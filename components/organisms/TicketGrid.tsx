"use client";

import React, { useState } from "react";
import TicketButton from "../atoms/TicketButton";
import Button from "../atoms/Button";

interface TicketGridProps {
  selectedNumbers: string[];
  soldNumbers: string[];
  onToggleNumber: (num: string) => void;
  onSelectRandom: (count: number) => void;
  totalTickets?: number;
}

type FilterType = "all" | "available" | "sold";

export default function TicketGrid({
  selectedNumbers,
  soldNumbers,
  onToggleNumber,
  onSelectRandom,
  totalTickets = 200,
}: TicketGridProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const padLength = totalTickets > 100 ? 3 : 2;

  // Generar números dinámicamente según la cantidad total
  const allNumbers = Array.from({ length: totalTickets }, (_, i) =>
    String(i + 1).padStart(padLength, "0")
  );

  const getStatus = (num: string): "available" | "selected" | "sold" => {
    if (soldNumbers.includes(num)) return "sold";
    if (selectedNumbers.includes(num)) return "selected";
    return "available";
  };

  const filteredNumbers = allNumbers.filter((num) => {
    // Filtro por búsqueda
    if (search && !num.includes(search)) return false;

    // Filtro por estado
    const status = getStatus(num);
    if (filter === "available" && status === "sold") return false;
    if (filter === "sold" && status !== "sold") return false;

    return true;
  });

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-6 w-full">
      {/* Encabezado y Selector Rápido */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide">
              Elige tus números
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Haz clic sobre los números libres que desees jugar.
            </p>
          </div>

          {/* Botones de Selección Rápida */}
          <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 border border-zinc-850 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 py-1 select-none">
              Azar:
            </span>
            {[1, 3, 5, 10].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onSelectRandom(count)}
                className="px-2.5 py-1 text-xs font-bold text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
              >
                +{count}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Búsqueda */}
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Buscar número..."
              value={search}
              onChange={(e) => setSearch(e.target.value.slice(0, padLength).replace(/\D/g, ""))}
              className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/60 transition-colors font-mono"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex items-center w-full sm:w-2/3 bg-zinc-950/60 p-1 border border-zinc-850 rounded-xl justify-between">
            {[
              { id: "all", label: "Todos" },
              { id: "available", label: "Disponibles" },
              { id: "sold", label: "Vendidos" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as FilterType)}
                className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab.id
                    ? "bg-zinc-800 text-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cuadrícula interactiva de 100 números */}
      <div className="w-full">
        {filteredNumbers.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            <p className="text-sm font-medium">No se encontraron números disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 md:gap-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredNumbers.map((num) => (
              <TicketButton
                key={num}
                number={num}
                status={getStatus(num)}
                onClick={() => onToggleNumber(num)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Leyenda de estados */}
      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-zinc-800/40 pt-4 text-xs font-semibold text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-zinc-900/40 border border-zinc-800" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-amber-500 to-yellow-400" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-zinc-950 border border-zinc-900 opacity-40 flex items-center justify-center text-[6px]">
            ✕
          </div>
          <span>Vendido / Reservado</span>
        </div>
      </div>
    </div>
  );
}
