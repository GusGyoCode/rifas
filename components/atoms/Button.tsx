import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    primary:
      "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/50",
    outline:
      "bg-transparent hover:bg-zinc-900 text-zinc-200 border border-zinc-700 hover:border-zinc-500",
    ghost:
      "bg-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200",
    gradient:
      "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-300 text-zinc-950 font-bold shadow-xl shadow-orange-500/20 tracking-wide hover:shadow-orange-500/30 hover:scale-[1.01]",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
