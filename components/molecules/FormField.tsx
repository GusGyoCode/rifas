import React from "react";
import Input from "../atoms/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorText?: string;
}

export default function FormField({
  label,
  errorText,
  id,
  ...props
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none"
      >
        {label}
      </label>
      <Input id={id} error={!!errorText} {...props} />
      {errorText && (
        <span className="text-xs text-rose-500 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {errorText}
        </span>
      )}
    </div>
  );
}
