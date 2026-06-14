"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { submitCareerApplication, type ActionState } from "@/app/actions";
import { jobs } from "@/lib/data";
import { careerSchema, type CareerInput } from "@/lib/validations";

const initialState: ActionState = {
  ok: false,
  message: "Ready",
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null;
}

export function CareerForm() {
  const [state, formAction] = useActionState(submitCareerApplication, initialState);
  const [isPending, startTransition] = useTransition();
  const resumeRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareerInput>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "",
      portfolio: "",
      message: "",
    },
  });

  useEffect(() => {
    if (state.ok) {
      reset();
      if (resumeRef.current) {
        resumeRef.current.value = "";
      }
    }
  }, [reset, state.ok]);

  function onValid(values: CareerInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value || ""));
    const file = resumeRef.current?.files?.[0];
    if (file) {
      formData.append("resume", file);
    }

    startTransition(() => {
      formAction(formData);
    });
  }

  const inputClass =
    "min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";

  return (
    <form onSubmit={handleSubmit(onValid)} className="interactive-card rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Full Name</span>
          <input className={inputClass} {...register("fullName")} autoComplete="name" />
          <FieldError message={errors.fullName?.message || state.errors?.fullName?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input className={inputClass} {...register("email")} type="email" autoComplete="email" />
          <FieldError message={errors.email?.message || state.errors?.email?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Phone Number</span>
          <input className={inputClass} {...register("phone")} type="tel" autoComplete="tel" />
          <FieldError message={errors.phone?.message || state.errors?.phone?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Role</span>
          <select className={inputClass} {...register("role")}>
            <option value="">Select role</option>
            {jobs.map((job) => (
              <option key={job.title}>{job.title}</option>
            ))}
          </select>
          <FieldError message={errors.role?.message || state.errors?.role?.[0]} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Portfolio or LinkedIn URL</span>
        <input className={inputClass} {...register("portfolio")} type="url" placeholder="https://" />
        <FieldError message={errors.portfolio?.message || state.errors?.portfolio?.[0]} />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Resume Upload</span>
        <input
          ref={resumeRef}
          className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white`}
          type="file"
          accept=".pdf,.doc,.docx"
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Message</span>
        <textarea className={`${inputClass} min-h-28 resize-y`} {...register("message")} />
        <FieldError message={errors.message?.message || state.errors?.message?.[0]} />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={state.ok ? "text-sm font-medium text-emerald-700" : "text-sm text-slate-500"}>
          {state.message !== "Ready" ? state.message : "Applications are reviewed in batches by role fit and portfolio quality."}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {isPending ? "Submitting..." : "Apply Now"}
        </button>
      </div>
    </form>
  );
}

