import { getSupabaseServerClient } from "@/lib/supabase";

type RequestRow = {
  id: string;
  subject: string | null;
  body: string | null;
  priority: string | null;
  status: string | null;
};

export async function ProjectRequestList({ projectId }: { projectId: string }) {
  const db = await getSupabaseServerClient();
  if (!db) return null;

  const { data } = await db
    .from("support_tickets")
    .select("id, subject, body, priority, status")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(50);

  const requests = (data || []) as RequestRow[];

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Client change requests</h2>
      <p className="mt-1 text-sm text-slate-500">Requests submitted from the client portal for this project.</p>
      <div className="mt-5 grid gap-3">
        {requests.length ? requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-950">{request.subject || "Project request"}</h3>
                <p className="mt-1 text-xs text-slate-400">Priority {request.priority || "normal"}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                {(request.status || "new").replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{request.body || "No description was provided."}</p>
          </article>
        )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No client change request has been submitted for this project.</p>}
      </div>
    </section>
  );
}
