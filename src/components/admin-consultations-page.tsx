import { CalendarCheck2, CalendarX2, CheckCircle2, Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { adminScheduleConsultation } from "@/app/workspace-actions";
import { AdminMobileHeader, AdminSidebar } from "@/components/admin-dashboard-navigation";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { getAdminWorkspaceData } from "@/lib/admin-workspace";
import { getSupabaseAdmin, getSupabaseServerClient } from "@/lib/supabase";

const input = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dateTime(value: string | null) {
  if (!value) return "Not booked";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "approved" || status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "reviewing" || status === "in_progress") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "closed") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

type ConsultationRow = {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  industry: string | null;
  budget: string | null;
  service_required: string;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  appointment_at: string | null;
  admin_notes: string | null;
  created_at: string;
};

export async function AdminConsultationsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const data = await getAdminWorkspaceData();
  if (data.dashboard.mode !== "live") return <PortalAccessGate dashboard={data.dashboard} />;

  const db = getSupabaseAdmin() || (await getSupabaseServerClient());
  const result = db
    ? await db
        .from("consultation_requests")
        .select("id, full_name, company_name, email, phone, industry, budget, service_required, message, preferred_date, preferred_time, status, appointment_at, admin_notes, created_at")
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [], error: null };
  const consultations = (result.data || []) as ConsultationRow[];

  const calendarConnected = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_CALENDAR_ID,
  );
  const emailConnected = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.CONTACT_EMAIL_TO);
  const whatsappConnected = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TO_NUMBER);

  return (
    <section className="min-h-[100dvh] bg-slate-100 text-slate-950">
      <div className="mx-auto w-full max-w-[1920px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar dashboard={data.dashboard} />
        <div className="min-w-0">
          <AdminMobileHeader dashboard={data.dashboard} />
          <main className="min-w-0 p-4 sm:p-6 xl:p-8">
            {first(searchParams?.portal_error) ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{first(searchParams?.portal_error)}</div> : null}
            {first(searchParams?.portal_notice) ? <div className="mb-4 flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4 flex-none" />{first(searchParams?.portal_notice)}</div> : null}

            <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Consultation operations</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Bookings, availability, and follow-up</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">Every website consultation appears here. Free calendar slots can be booked automatically; conflicts remain visible for manual rescheduling.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className={`rounded-2xl border p-4 ${calendarConnected ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><p className="text-xs font-semibold text-slate-500">Google Calendar</p><p className="mt-1 font-bold">{calendarConnected ? "Connected" : "Needs OAuth secrets"}</p></div>
                <div className={`rounded-2xl border p-4 ${emailConnected ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><p className="text-xs font-semibold text-slate-500">Gmail notification</p><p className="mt-1 font-bold">{emailConnected ? "Email delivery ready" : "AWS SES not configured"}</p></div>
                <div className={`rounded-2xl border p-4 ${whatsappConnected ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><p className="text-xs font-semibold text-slate-500">WhatsApp alert</p><p className="mt-1 font-bold">{whatsappConnected ? "Cloud API ready" : "WhatsApp secrets missing"}</p></div>
              </div>
            </header>

            {result.error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error.message}</div> : null}

            <div className="mt-6 grid gap-5">
              {consultations.length ? consultations.map((item) => {
                const booked = Boolean(item.appointment_at);
                return (
                  <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold">{item.full_name}</h2>
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(item.status)}`}>{item.status.replaceAll("_", " ")}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.company_name || "Individual enquiry"} · {item.service_required}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <a className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-slate-700" href={`mailto:${item.email}`}><Mail className="h-3.5 w-3.5" />{item.email}</a>
                          <a className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700" href={`tel:${item.phone}`}><Phone className="h-3.5 w-3.5" />{item.phone}</a>
                          <a className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-2 text-green-700" href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</a>
                        </div>
                      </div>
                      <div className={`rounded-2xl border px-5 py-4 ${booked ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide"><Clock3 className="h-4 w-4" />Appointment</p>
                        <p className="mt-2 font-semibold">{dateTime(item.appointment_at)}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Client request</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.message}</p><p className="mt-3 text-xs text-slate-500">Preferred: {item.preferred_date || "Not selected"} {item.preferred_time || ""}</p>{item.admin_notes ? <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-slate-600">{item.admin_notes}</p> : null}</div>

                      <form action={adminScheduleConsultation} className="rounded-2xl border border-slate-200 p-4">
                        <input type="hidden" name="consultationId" value={item.id} />
                        <p className="inline-flex items-center gap-2 font-semibold">{booked ? <CalendarCheck2 className="h-4 w-4 text-emerald-600" /> : <CalendarX2 className="h-4 w-4 text-amber-600" />}Check and book another slot</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="text-sm font-semibold text-slate-700">Date<input className={input} name="date" type="date" required defaultValue={item.preferred_date || ""} /></label>
                          <label className="text-sm font-semibold text-slate-700">Time<input className={input} name="time" type="time" required defaultValue={item.preferred_time || ""} /></label>
                        </div>
                        <label className="mt-3 block text-sm font-semibold text-slate-700">Admin note<textarea className={`${input} min-h-20 resize-y py-3`} name="notes" defaultValue={item.admin_notes || ""} /></label>
                        <button className="mt-4 min-h-10 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-blue-700" type="submit">Check availability and book</button>
                      </form>
                    </div>
                  </article>
                );
              }) : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><CalendarCheck2 className="mx-auto h-9 w-9 text-slate-400" /><h2 className="mt-4 text-lg font-semibold">No consultation requests yet</h2><p className="mt-2 text-sm text-slate-500">New website bookings will appear here automatically.</p></div>}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
