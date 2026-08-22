import React from "react";
import Button from "../atoms/Button";

interface SummaryCardProps {
  selectedNumbers: string[];
  pricePerTicket: number;
  onClear: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function SummaryCard({
  selectedNumbers,
  pricePerTicket,
  onClear,
  onSubmit,
  isSubmitting = false,
}: SummaryCardProps) {
  const total = selectedNumbers.length * pricePerTicket;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <h3 className="font-bold text-zinc-100 flex items-center gap-2">
          <span>🛒</span> Resumen de compra
        </h3>
        {selectedNumbers.length > 0 && (
          <button
            onClick={onClear}
            type="button"
            className="text-xs font-semibold text-zinc-500 hover:text-rose-400 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {selectedNumbers.length === 0 ? (
        <div className="py-6 text-center text-zinc-500 flex flex-col items-center gap-2">
          <span className="text-2xl opacity-60">🎟️</span>
          <p className="text-sm font-medium">Selecciona al menos un número para continuar</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Boletos seleccionados ({selectedNumbers.length})
            </span>
            <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-1">
              {selectedNumbers.map((num) => (
                <span
                  key={num}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold"
                >
                  #{num}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mt-2">
            <span className="text-sm font-semibold text-zinc-400">Total a pagar:</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              ${total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
              <span className="text-xs font-bold text-zinc-400 ml-1">USD</span>
            </span>
          </div>

          <Button
            variant="gradient"
            fullWidth
            onClick={onSubmit}
            disabled={isSubmitting}
            className="py-3 mt-1"
          >
            {isSubmitting ? "Procesando..." : "Comprar Boletos ahora"}
          </Button>
        </div>
      )}
    </div>
  );
}
