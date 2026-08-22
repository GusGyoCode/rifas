"use client";

import React, { useState, useEffect } from "react";
import Badge from "../atoms/Badge";
import PrizeDetail from "../molecules/PrizeDetail";

interface PrizeHeroProps {
  title: string;
  description: string;
  pricePerTicket: number;
  drawDate: string;
  drawMethod: string;
  targetDate: string; // ISO date string for countdown
  prizeName?: string;
  priceNote?: string;
  soldCount?: number;
  totalCount?: number;
  onShowPrizeDetails?: () => void;
}

export default function PrizeHero({
  title,
  description,
  pricePerTicket,
  drawDate,
  drawMethod,
  targetDate,
  prizeName = "Una Vaca de Finca",
  priceNote,
  soldCount = 0,
  totalCount = 200,
  onShowPrizeDetails,
}: PrizeHeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const percent = totalCount > 0 ? Math.round((soldCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full lg:sticky lg:top-6">
      {/* Badge de estado */}
      <div className="flex items-center gap-2">
        <Badge variant="danger" className="text-xs uppercase px-3 py-1 font-extrabold tracking-widest animate-pulse">
          ❤️ Causa Solidaria
        </Badge>
        <Badge variant="success" className="text-xs uppercase px-3 py-1 font-extrabold tracking-widest">
          {percent}% Vendido
        </Badge>
      </div>

      {/* Título y descripción */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 leading-tight">
          {title}
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {/* Barra de Progreso de Ventas */}
      <div className="flex flex-col gap-2 w-full bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-450 uppercase tracking-wider text-[10px]">Progreso de Recaudación</span>
          <span className="text-amber-400 font-mono">{soldCount} / {totalCount} ({percent}%)</span>
        </div>
        <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-900 p-[1px]">
          <div
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-right">
          Meta: Cubrir Gastos Legales
        </span>
      </div>

      {/* Ilustración visual del Premio (Premium Mockup CSS/SVG) */}
      <div
        onClick={onShowPrizeDetails}
        className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 shadow-2xl flex items-center justify-center p-8 group ${
          onShowPrizeDetails ? "cursor-pointer hover:border-amber-500/30 active:scale-[0.99]" : ""
        } transition-all`}
      >
        {/* Glow Effects background */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Decoraciones abstractas estilo Glassmorphism */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <span className="text-[10px] font-mono text-zinc-600">RIFA ID: #983-AMB</span>
          <span className="text-[10px] font-mono text-amber-500/40">★ SOLIDARY DRAW ★</span>
        </div>

        {/* Ilustración del Premio (Vaca minimalista SVG) */}
        <div className="flex flex-col items-center gap-4 text-center z-10 transition-all duration-300 group-hover:translate-y-[-4px]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Vaca brillante en SVG */}
            <svg
              className="w-full h-full text-amber-500 animate-bounce duration-[2.5s]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Ears */}
              <path d="M3 10c0-2 2-3 4-1" />
              <path d="M21 10c0-2-2-3-4-1" />
              {/* Horns */}
              <path d="M7 6c-1-2-2-2-3-1" />
              <path d="M17 6c1-2 2-2 3-1" />
              {/* Face/Head */}
              <path d="M6 9v5c0 3 2 5 6 5s6-2 6-5V9" />
              {/* Snout */}
              <rect x="8" y="13" width="8" height="4" rx="2" className="fill-amber-500/10" />
              {/* Nostrils */}
              <circle cx="10.5" cy="15" r="0.75" fill="currentColor" />
              <circle cx="13.5" cy="15" r="0.75" fill="currentColor" />
              {/* Eyes */}
              <circle cx="9" cy="10" r="0.75" fill="currentColor" />
              <circle cx="15" cy="10" r="0.75" fill="currentColor" />
            </svg>
            <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-wide group-hover:text-amber-400 transition-colors">
              {prizeName}
            </h2>
            <p className="text-xs text-amber-400/70 font-mono tracking-widest mt-1">
              O EQUIVALENTE EN EFECTIVO
            </p>
          </div>
        </div>

        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/40" />
      </div>

      {/* Detalles del Premio (Boleto, fecha, etc.) */}
      <PrizeDetail
        price={pricePerTicket}
        drawDate={drawDate}
        drawMethod={drawMethod}
        priceNote={priceNote}
      />

      {/* Cuenta Regresiva */}
      {mounted && (
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-center lg:text-left">
            El sorteo finaliza en:
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Días", value: timeLeft.days },
              { label: "Horas", value: timeLeft.hours },
              { label: "Minutos", value: timeLeft.minutes },
              { label: "Segundos", value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5 flex flex-col items-center justify-center min-w-[60px]"
              >
                <span className="text-xl md:text-2xl font-black text-zinc-100 font-mono">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
