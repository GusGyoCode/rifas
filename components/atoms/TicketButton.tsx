import React from "react";

interface TicketButtonProps {
  number: string;
  status: "available" | "selected" | "sold";
  onClick?: () => void;
}

export default function TicketButton({
  number,
  status,
  onClick,
}: TicketButtonProps) {
  const baseStyles =
    "aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden select-none focus:outline-none";

  const states = {
    available:
      "bg-zinc-900/40 border border-zinc-800/80 text-zinc-300 hover:border-amber-500/60 hover:text-amber-400 hover:scale-[1.08] hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.95] cursor-pointer",
    selected:
      "bg-gradient-to-br from-amber-500 to-yellow-400 text-zinc-950 font-bold border border-transparent scale-[1.05] shadow-lg shadow-amber-500/20 hover:scale-[1.1] cursor-pointer",
    sold: "bg-zinc-950/80 border border-zinc-900/60 text-zinc-600 line-through opacity-40 cursor-not-allowed",
  };

  return (
    <button
      onClick={status !== "sold" ? onClick : undefined}
      disabled={status === "sold"}
      className={`${baseStyles} ${states[status]}`}
      type="button"
      aria-label={`Boleto número ${number}, estado: ${
        status === "selected"
          ? "seleccionado"
          : status === "sold"
          ? "vendido"
          : "disponible"
      }`}
    >
      {number}
      {status === "sold" && (
        <span className="absolute bottom-1 right-1 text-[8px] text-zinc-700/80 leading-none select-none">
          ✕
        </span>
      )}
    </button>
  );
}
