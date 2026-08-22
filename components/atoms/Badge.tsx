import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-200";

  const variants = {
    primary:
      "bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-sm",
    success:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm",
    warning:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 backdrop-blur-sm",
    danger:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20 backdrop-blur-sm",
    neutral:
      "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 backdrop-blur-sm",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
