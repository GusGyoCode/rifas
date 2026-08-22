"use client";

import React from "react";
import Button from "../atoms/Button";

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrizeModal({ isOpen, onClose }: PrizeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-250">
        
        {/* Header visual superior */}
        <div className="h-32 bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-b border-zinc-850 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <span className="text-4xl mb-1.5 filter drop-shadow-md">🐄</span>
          <h3 className="text-xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            Términos del Premio
          </h3>
          
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-zinc-500 hover:text-zinc-300 font-bold text-sm"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          
          {/* Opción A: Vaca */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-lg flex-shrink-0">
              🌱
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-zinc-200">Gran Premio Principal: La Novilla</span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Una vaca de finca (novilla) de aproximadamente <b>3 años de edad, lactante</b>. Ha sido criada con estrictos estándares de cuidado agropecuario, contando con su respectivo **control veterinario al día, desparasitación y vacunación**.
              </p>
            </div>
          </div>

          {/* Opción B: Efectivo */}
          <div className="flex gap-4 border-t border-zinc-850 pt-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-lg flex-shrink-0">
              💵
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-zinc-200">Equivalente en Efectivo (Alternativa)</span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                En caso de que el ganador no cuente con transporte, finca o las condiciones adecuadas para el cuidado de la vaca, podrá optar por recibir el equivalente en efectivo por un valor neto de **$300.00 USD** (o su valor correspondiente en bolívares a la tasa oficial del BCV).
              </p>
            </div>
          </div>

          {/* Botón de cierre */}
          <div className="mt-2">
            <Button
              variant="gradient"
              fullWidth
              onClick={onClose}
              className="py-3"
            >
              Entendido
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
