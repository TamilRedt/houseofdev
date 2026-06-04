"use server";

import { headers } from "next/headers";
import { sendLeadNotifications, type NotificationResult } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";
import { careerSchema, contactSchema } from "@/lib/validations";

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function getFirstIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "anonymous";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
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

async function assertRateLimit(scope: string) {
  const headerStore = await headers();
  const ip = getFirstIp(headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip"));
  return checkRateLimit(`${scope}:${ip}`);
}

async function getRequestContext() {
  const headerStore = await headers();

  return {
    ip: getFirstIp(headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip")),
    userAgent: headerStore.get("user-agent") || null,
  };
}

async function recordActivityLog({
  email,
  eventType,
  status = "success",
  metadata = {},
}: {
  email?: string;
  eventType: string;
  status?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return;
  }

  const context = await getRequestContext();
  await supabase.from("portal_activity_logs").insert({
    email: email || null,
    event_type: eventType,
    status,
    ip_address: context.ip,
    user_agent: context.userAgent,
    metadata,
  });
}

async function recordNotificationEvents({
  relatedTable,
  relatedId,
  eventType,
  results,
}: {
  relatedTable: string;
  relatedId: string | null;
  eventType: string;
  results: NotificationResult[];
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase || !results.length) {
    return;
  }

  await supabase.from("notification_events").insert(
    results.map((result) => ({
      related_table: relatedTable,
      related_id: relatedId,
      event_type: eventType,
      channel: result.channel,
      target: result.target,
      status: result.sent ? "sent" : "skipped",
      response: result.response || result.reason || null,
    })),
  );
}

export async function submitContact(_: ActionState, formData: FormData): Promise<ActionState> {
  const limited = await assertRateLimit("contact");
  if (!limited) {
    return {
      ok: false,
      message: "Too many requests. Please wait a minute and try again.",
    };
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
    return {
      ok: true,
      message: "Thanks. We will review your request shortly.",
    };
  }

  const supabase = getSupabaseAdmin();
  let contactRequestId: string | null = null;
  let consultationRequestId: string | null = null;

  if (supabase) {
    const contactResult = await supabase.from("contact_requests").insert({
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
    }).select("id").maybeSingle();

    if (!contactResult.error && contactResult.data) {
      contactRequestId = String(contactResult.data.id);
    }

    const consultationResult = await supabase.from("consultation_requests").insert({
      contact_request_id: contactRequestId,
      full_name: parsed.data.fullName,
      company_name: parsed.data.companyName,
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
    }).select("id").maybeSingle();

    if (!consultationResult.error && consultationResult.data) {
      consultationRequestId = String(consultationResult.data.id);
    }

    if (contactResult.error && consultationResult.error) {
      return {
        ok: false,
        message: "We could not store the request. Please run the Supabase portal migration or contact us directly.",
      };
    }

    await recordActivityLog({
      email: parsed.data.email,
      eventType: "consultation_request_submitted",
      metadata: {
        contactRequestId,
        consultationRequestId,
        service: parsed.data.serviceRequired,
        preferredDate: parsed.data.preferredDate || null,
        preferredTime: parsed.data.preferredTime || null,
      },
    });
  }

  const notificationText = [
    "New HouseOfDev consultation request",
    `Name: ${parsed.data.fullName}`,
    `Company: ${parsed.data.companyName}`,
    `Email: ${parsed.data.email}`,
    `Phone: ${parsed.data.phone}`,
    `Industry: ${parsed.data.industry}`,
    `Budget: ${parsed.data.budget}`,
    `Service: ${parsed.data.serviceRequired}`,
    `Preferred: ${parsed.data.preferredDate || "-"} ${parsed.data.preferredTime || ""}`.trim(),
    `Message: ${parsed.data.message}`,
  ].join("\n");
  const notificationResults = await sendLeadNotifications({
    subject: `New HouseOfDev inquiry from ${parsed.data.fullName}`,
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#0f172a">New HouseOfDev inquiry</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
      Name: parsed.data.fullName,
      Company: parsed.data.companyName,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Industry: parsed.data.industry,
      Budget: parsed.data.budget,
      Service: parsed.data.serviceRequired,
      "Preferred Date": parsed.data.preferredDate || "-",
      "Preferred Time": parsed.data.preferredTime || "-",
      Message: parsed.data.message,
    })}</table>`,
    text: notificationText,
  });
  await recordNotificationEvents({
    relatedTable: consultationRequestId ? "consultation_requests" : "contact_requests",
    relatedId: consultationRequestId || contactRequestId,
    eventType: "consultation_request_submitted",
    results: notificationResults,
  });

  const notified = notificationResults.some((result) => result.sent);

  return {
    ok: true,
    message: supabase || notified
      ? "Thanks. Your request has been received, and our team will contact you shortly."
      : "Thanks. Your request was prepared, but storage is not configured yet. Please message us directly if this is urgent.",
  };
}

export async function submitCareerApplication(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limited = await assertRateLimit("career");
  if (!limited) {
    return {
      ok: false,
      message: "Too many requests. Please wait a minute and try again.",
    };
  }

  const raw = {
    fullName: String(formData.get("fullName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    role: String(formData.get("role") || ""),
    portfolio: String(formData.get("portfolio") || ""),
    message: String(formData.get("message") || ""),
  };

  const parsed = careerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = getSupabaseAdmin();
  const resume = formData.get("resume");
  let resumePath: string | null = null;

  if (supabase && resume instanceof File && resume.size > 0) {
    const bucket = process.env.SUPABASE_RESUME_BUCKET || "career-resumes";
    const extension = resume.name.split(".").pop() || "pdf";
    const path = `${parsed.data.role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(path, resume, {
      contentType: resume.type || "application/octet-stream",
      upsert: false,
    });

    if (!error) {
      resumePath = path;
    }
  }

  if (supabase) {
    const { error } = await supabase.from("career_applications").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role,
      portfolio: parsed.data.portfolio || null,
      message: parsed.data.message,
      resume_path: resumePath,
      status: "new",
    });

    if (error) {
      return {
        ok: false,
        message: "We could not store the application. Please try again later.",
      };
    }
  }

  const careerNotificationText = [
    "New HouseOfDev career application",
    `Name: ${parsed.data.fullName}`,
    `Email: ${parsed.data.email}`,
    `Phone: ${parsed.data.phone}`,
    `Role: ${parsed.data.role}`,
    `Portfolio: ${parsed.data.portfolio || "-"}`,
    `Resume: ${resumePath || "Not uploaded or storage not configured"}`,
    `Message: ${parsed.data.message}`,
  ].join("\n");
  const notificationResults = await sendLeadNotifications({
    subject: `New HouseOfDev career application - ${parsed.data.role}`,
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#0f172a">New career application</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
      Name: parsed.data.fullName,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Role: parsed.data.role,
      Portfolio: parsed.data.portfolio || "-",
      Resume: resumePath || "Not uploaded or storage not configured",
      Message: parsed.data.message,
    })}</table>`,
    text: careerNotificationText,
  });
  await recordNotificationEvents({
    relatedTable: "career_applications",
    relatedId: null,
    eventType: "career_application_submitted",
    results: notificationResults,
  });

  return {
    ok: true,
    message: supabase
      ? "Application received. We will review it and contact shortlisted candidates."
      : "Application details were prepared, but storage is not configured yet. Please email us directly if this is urgent.",
  };
}
