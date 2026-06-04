"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  label: string;
  name: string;
  autoComplete: string;
  className: string;
  labelClassName?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
};

export function PasswordField({
  label,
  name,
  autoComplete,
  className,
  labelClassName = "text-sm font-medium text-blue-700",
  placeholder,
  required = true,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <label className="block">
      <span className={labelClassName}>{label}</span>
      <div className="relative mt-2">
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          className={`${className.replace("mt-2", "")} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon className="h-4 w-4" />
        </button>
      </div>
    </label>
  );
}
