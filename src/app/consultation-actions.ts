"use server";

import { headers } from "next/headers";
import { buildConsultationSlot, createConsultationEvent } from "@/lib/google-calendar";
import { sendLeadNotifications, type NotificationResult } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";
import { contactSchema } from "@/lib/validations";

export type ConsultationActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function firstIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "anonymous";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rows(payload: Record<string, string | null | undefined>) {
  return Object.entries(payload)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#475569">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:600">${escapeHtml(value || "-")}</td></tr>`,
    )
    .join("");
}

async function recordNotificationEvents({
  relatedId,
  results,
}: {
  relatedId: string | null;
  results: NotificationResult[];
}) {
  const db = getSupabaseAdmin();
  if (!db || !results.length) return;

  await db.from("notification_events").insert(
    results.map((result) => ({
      related_table: "consultation_requests",
      related_id: relatedId,
      event_type: "consultation_request_submitted",
      channel: result.channel,
      target: result.target,
      status: result.sent ? "sent" : "skipped",
      response: result.response || result.reason || null,
    })),
  );
}

export async function submitConsultation(
  _: ConsultationActionState,
  formData: FormData,
): Promise<ConsultationActionState> {
  const headerStore = await headers();
  const ip = firstIp(headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip"));
  const limited = await checkRateLimit(`consultation:${ip}`);

  if (!limited) {
    return { ok: false, message: "Too many requests. Please wait a minute and try again." };
  }

  const raw = {
    fullName: String(formData.get("fullName") || ""),
    companyName: String(formData.get("companyName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    industry: String(formData.get("industry") || ""),
    budget: String(formData.get("budget") || ""),
    serviceRequired: String(formData.get("serviceRequired") || ""),
    preferredDate: String(formData.get("preferredDate") || ""),
    preferredTime: String(formData.get("preferredTime") || ""),
    message: String(formData.get("message") || ""),
    website: String(formData.get("website") || ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.website) {
    return { ok: true, message: "Thanks. We will review your request shortly." };
  }

  const db = getSupabaseAdmin();
  let contactRequestId: string | null = null;
  let consultationRequestId: string | null = null;
  let calendarMessage = "Calendar check was not requested.";
  let clientMessage = "Thanks. Your request has been received, and our team will contact you shortly.";

  if (db) {
    const contactResult = await db
      .from("contact_requests")
      .insert({
        full_name: parsed.data.fullName,
        company_name: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        industry: parsed.data.industry,
        budget: parsed.data.budget,
        service_required: parsed.data.serviceRequired,
        message: parsed.data.message,
        source: "website-consultation",
        status: "new",
      })
      .select("id")
      .maybeSingle();

    if (!contactResult.error && contactResult.data) contactRequestId = String(contactResult.data.id);

    const consultationResult = await db
      .from("consultation_requests")
      .insert({
        contact_request_id: contactRequestId,
        full_name: parsed.data.fullName,
        company_name: parsed.data.companyName || null,
        email: parsed.data.email,
        phone: parsed.data.phone,
        industry: parsed.data.industry,
        budget: parsed.data.budget,
        service_required: parsed.data.serviceRequired,
        message: parsed.data.message,
        preferred_date: parsed.data.preferredDate || null,
        preferred_time: parsed.data.preferredTime || null,
        source: "website-consultation",
        status: "new",
      })
      .select("id")
      .maybeSingle();

    if (!consultationResult.error && consultationResult.data) {
      consultationRequestId = String(consultationResult.data.id);
    }

    if (contactResult.error && consultationResult.error) {
      return {
        ok: false,
        message: "We could not store the request. Please contact HouseOfDev directly.",
      };
    }

    if (consultationRequestId && parsed.data.preferredDate && parsed.data.preferredTime) {
      const slot = buildConsultationSlot(parsed.data.preferredDate, parsed.data.preferredTime);

      if (!slot) {
        calendarMessage = "Preferred date/time could not be parsed; manual review required.";
        await db
          .from("consultation_requests")
          .update({ status: "reviewing", admin_notes: calendarMessage, updated_at: new Date().toISOString() })
          .eq("id", consultationRequestId);
      } else {
        const booking = await createConsultationEvent({
          slot,
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          companyName: parsed.data.companyName,
          service: parsed.data.serviceRequired,
          message: parsed.data.message,
        });

        if (booking.booked) {
          calendarMessage = "Slot was free and booked automatically in Google Calendar.";
          clientMessage = "Your consultation slot is available and has been booked. Check your email for the calendar invitation.";
          await db
            .from("consultation_requests")
            .update({
              status: "approved",
              appointment_at: slot.start,
              admin_notes: booking.eventUrl ? `${calendarMessage} ${booking.eventUrl}` : calendarMessage,
              updated_at: new Date().toISOString(),
            })
            .eq("id", consultationRequestId);
        } else if (booking.available === false) {
          calendarMessage = "Requested time conflicts with an existing calendar event; manual rescheduling required.";
          clientMessage = "Your preferred time is currently busy. HouseOfDev will contact you with the nearest available slot.";
          await db
            .from("consultation_requests")
            .update({ status: "reviewing", admin_notes: calendarMessage, updated_at: new Date().toISOString() })
            .eq("id", consultationRequestId);
        } else {
          calendarMessage = booking.reason || "Google Calendar is not connected; manual confirmation required.";
          clientMessage = "Your consultation request is saved. HouseOfDev will manually confirm the time shortly.";
          await db
            .from("consultation_requests")
            .update({ status: "reviewing", admin_notes: calendarMessage, updated_at: new Date().toISOString() })
            .eq("id", consultationRequestId);
        }
      }
    }

    await db.from("portal_activity_logs").insert({
      email: parsed.data.email,
      event_type: "consultation_request_submitted",
      status: "success",
      ip_address: ip,
      user_agent: headerStore.get("user-agent") || null,
      metadata: {
        contactRequestId,
        consultationRequestId,
        calendarMessage,
        preferredDate: parsed.data.preferredDate || null,
        preferredTime: parsed.data.preferredTime || null,
      },
    });
  }

  const text = [
    "New HouseOfDev consultation request",
    `Name: ${parsed.data.fullName}`,
    `Company: ${parsed.data.companyName || "-"}`,
    `Email: ${parsed.data.email}`,
    `Phone: ${parsed.data.phone}`,
    `Industry: ${parsed.data.industry}`,
    `Budget: ${parsed.data.budget}`,
    `Service: ${parsed.data.serviceRequired}`,
    `Preferred: ${parsed.data.preferredDate || "-"} ${parsed.data.preferredTime || ""}`.trim(),
    `Calendar: ${calendarMessage}`,
    `Message: ${parsed.data.message}`,
  ].join("\n");

  const notificationResults = await sendLeadNotifications({
    subject: `New HouseOfDev consultation — ${parsed.data.fullName}`,
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#172A46">New HouseOfDev consultation</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
      Name: parsed.data.fullName,
      Company: parsed.data.companyName || "-",
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Industry: parsed.data.industry,
      Budget: parsed.data.budget,
      Service: parsed.data.serviceRequired,
      "Preferred Date": parsed.data.preferredDate || "-",
      "Preferred Time": parsed.data.preferredTime || "-",
      Calendar: calendarMessage,
      Message: parsed.data.message,
    })}</table>`,
    text,
  });

  await recordNotificationEvents({ relatedId: consultationRequestId || contactRequestId, results: notificationResults });

  return {
    ok: true,
    message: db || notificationResults.some((item) => item.sent)
      ? clientMessage
      : "Your request is ready, but the backend notification channels are not configured yet.",
  };
}
