"use client";

import { useActionState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { submitContact, type ActionState } from "@/app/actions";
import { services } from "@/lib/data";
import { contactSchema, type ContactInput } from "@/lib/validations";

const initialState: ActionState = {
  ok: false,
  message: "Ready",
};

const industries = [
  "Healthcare",
  "Restaurant",
  "Education",
  "Construction",
  "Retail",
  "Professional Services",
  "Startup",
  "Enterprise",
];

const budgets = ["INR 4,999 - 9,999", "INR 10,000 - 24,999", "INR 25,000 - 75,000", "INR 75,000+"];

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null;
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      industry: "",
      budget: "",
      serviceRequired: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
      website: "",
    },
  });

  useEffect(() => {
    if (state.ok) {
      reset();
    }
  }, [reset, state.ok]);

  function onValid(values: ContactInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

    startTransition(() => {
      formAction(formData);
    });
  }

  const inputClass =
    "min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";

  return (
    <form onSubmit={handleSubmit(onValid)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Full Name</span>
          <input className={inputClass} {...register("fullName")} autoComplete="name" />
          <FieldError message={errors.fullName?.message || state.errors?.fullName?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Company Name</span>
          <input className={inputClass} {...register("companyName")} autoComplete="organization" />
          <FieldError message={errors.companyName?.message || state.errors?.companyName?.[0]} />
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
          <span className="text-sm font-semibold text-slate-700">Industry</span>
          <select className={inputClass} {...register("industry")}>
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry}>{industry}</option>
            ))}
          </select>
          <FieldError message={errors.industry?.message || state.errors?.industry?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Budget</span>
          <select className={inputClass} {...register("budget")}>
            <option value="">Select budget</option>
            {budgets.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
          <FieldError message={errors.budget?.message || state.errors?.budget?.[0]} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Service Required</span>
        <select className={inputClass} {...register("serviceRequired")}>
          <option value="">Select service</option>
          {services.map((service) => (
            <option key={service.slug}>{service.title}</option>
          ))}
        </select>
        <FieldError message={errors.serviceRequired?.message || state.errors?.serviceRequired?.[0]} />
      </label>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Preferred Date</span>
          <input className={inputClass} {...register("preferredDate")} type="date" />
          <FieldError message={errors.preferredDate?.message || state.errors?.preferredDate?.[0]} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Preferred Time</span>
          <input className={inputClass} {...register("preferredTime")} placeholder="Example: 11:00 AM" />
          <FieldError message={errors.preferredTime?.message || state.errors?.preferredTime?.[0]} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">Message</span>
        <textarea className={`${inputClass} min-h-32 resize-y`} {...register("message")} />
        <FieldError message={errors.message?.message || state.errors?.message?.[0]} />
      </label>

      <label className="hide-honeypot">
        Website
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={state.ok ? "text-sm font-medium text-emerald-700" : "text-sm text-slate-500"}>
          {state.message !== "Ready" ? state.message : "Your project details stay private and are reviewed by the HouseOfDev team."}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}

