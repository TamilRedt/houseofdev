import { BarChart3, CalendarDays, CheckCircle2, MessageSquareText } from "lucide-react";
import type { PortfolioProject } from "@/lib/data";

export function ProjectVisual({ project }: { project: PortfolioProject }) {
  const metrics = [
    { label: "Requests", value: project.results[0], Icon: MessageSquareText },
    { label: "Schedule", value: "Live workflow", Icon: CalendarDays },
    { label: "Analytics", value: "Tracked", Icon: BarChart3 },
    { label: "Status", value: "Optimized", Icon: CheckCircle2 },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/8">
      <div className={`rounded-md bg-gradient-to-br ${project.palette} p-1`}>
        <div className="rounded bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
              {project.category}
            </span>
          </div>
          <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-slate-200 p-4 md:border-b-0 md:border-r">
              <div className={`h-24 rounded-md bg-gradient-to-br ${project.palette}`} />
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{project.title}</h3>
              <div className="mt-4 space-y-2">
                {project.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {metrics.map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <p className="mt-3 text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 rounded bg-slate-100">
                <div className={`h-2 w-3/4 rounded bg-gradient-to-r ${project.palette}`} />
              </div>
              <div className="mt-3 h-2 rounded bg-slate-100">
                <div className={`h-2 w-1/2 rounded bg-gradient-to-r ${project.palette}`} />
              </div>
              <div className="mt-3 h-2 rounded bg-slate-100">
                <div className={`h-2 w-5/6 rounded bg-gradient-to-r ${project.palette}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
