import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`w-full rounded-xl bg-zinc-900/50 border ${
        error
          ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
          : "border-zinc-800 focus:border-amber-500/80 focus:ring-amber-500/20"
      } px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-4 backdrop-blur-sm`}
      {...props}
    />
  );
}
