import React from "react";

interface PrizeDetailProps {
  price: number;
  drawDate: string;
  drawMethod: string;
  priceNote?: string;
}

export default function PrizeDetail({
  price,
  drawDate,
  drawMethod,
  priceNote,
}: PrizeDetailProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-3.5 backdrop-blur-sm">
        <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
          Valor del Boleto
        </span>
        <span className="text-xl font-extrabold text-amber-400">
          ${price.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
          <span className="text-xs font-medium text-zinc-400 ml-1">USD</span>
          {priceNote && (
            <span className="block text-[9px] font-medium text-zinc-400 mt-0.5">
              {priceNote}
            </span>
          )}
        </span>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-3.5 backdrop-blur-sm">
        <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
          Fecha del Sorteo
        </span>
        <span className="text-sm font-bold text-zinc-200">
          {drawDate}
        </span>
      </div>

      <div className="col-span-2 bg-zinc-900/20 border border-zinc-850 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 text-sm">
          🎲
        </div>
        <div>
          <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
            Método de Sorteo
          </span>
          <span className="text-xs font-semibold text-zinc-300">
            {drawMethod}
          </span>
        </div>
      </div>
    </div>
  );
}
