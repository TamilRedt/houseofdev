import { MessageSquareText, Star } from "lucide-react";
import { adminAddProjectReview } from "@/app/workspace-actions";
import { getSupabaseAdmin, getSupabaseServerClient } from "@/lib/supabase";

const input =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function date(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export async function ProjectReviewPanel({ projectId }: { projectId: string }) {
  const db = getSupabaseAdmin() || (await getSupabaseServerClient());
  const result = db
    ? await db
        .from("project_reviews")
        .select("id, rating, review, review_type, created_at, reviewer_id")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: [], error: null };

  const reviews = result.data || [];

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><MessageSquareText className="h-5 w-5" /></span>
        <div><h2 className="text-xl font-semibold">Project reviews</h2><p className="mt-1 text-sm text-slate-500">Save admin review notes and keep a readable project decision history.</p></div>
      </div>

      <form action={adminAddProjectReview} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <input type="hidden" name="projectId" value={projectId} />
        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
          <label className="text-sm font-semibold text-slate-700">Rating
            <select className={input} name="rating" defaultValue="3">
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — On track</option>
              <option value="2">2 — Needs work</option>
              <option value="1">1 — Critical</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">Review note
            <textarea className={`${input} min-h-24 resize-y py-3`} name="review" required placeholder="What is going well, what needs attention, and the next decision?" />
          </label>
        </div>
        <button className="mt-4 min-h-10 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800" type="submit">Save project review</button>
      </form>

      <div className="mt-5 grid gap-3">
        {reviews.length ? reviews.map((review) => (
          <article key={String(review.id)} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600"><Star className="h-4 w-4 fill-current" />{Number(review.rating || 0)}/5</span>
              <span className="text-xs text-slate-500">{date(String(review.created_at))} · {String(review.review_type || "review").replaceAll("_", " ")}</span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{String(review.review)}</p>
          </article>
        )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No project review has been saved yet.</p>}
      </div>
    </section>
  );
}
