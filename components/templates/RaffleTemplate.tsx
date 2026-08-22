import React from "react";

interface RaffleTemplateProps {
  header?: React.ReactNode;
  prizeHero: React.ReactNode;
  ticketGrid: React.ReactNode;
  checkoutForm: React.ReactNode;
  footer?: React.ReactNode;
}

export default function RaffleTemplate({
  header,
  prizeHero,
  ticketGrid,
  checkoutForm,
  footer,
}: RaffleTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      {/* Cabecera / Navbar */}
      {header && (
        <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {header}
          </div>
        </header>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columna Izquierda: Presentación del Premio / Sorteo */}
          <section className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
            {prizeHero}
          </section>

          {/* Columna Derecha: Selección de boletos y Formulario de compra */}
          <section className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
            {ticketGrid}
            {checkoutForm}
          </section>
        </div>
      </main>

      {/* Pie de Página */}
      {footer && (
        <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-12 text-center text-xs text-zinc-600 font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
