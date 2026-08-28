"use client";

import React, { useState } from "react";
import RaffleTemplate from "../components/templates/RaffleTemplate";
import PrizeHero from "../components/organisms/PrizeHero";
import TicketGrid from "../components/organisms/TicketGrid";
import CheckoutForm from "../components/organisms/CheckoutForm";
import Button from "../components/atoms/Button";
import PaymentModal, { VENEZUELAN_BANKS } from "../components/organisms/PaymentModal";
import PrizeModal from "../components/organisms/PrizeModal";
import TermsModal from "../components/organisms/TermsModal";
import PrivacyModal from "../components/organisms/PrivacyModal";
import {
  suscribirBoletos,
  registrarCompra,
  verificarYRepararBoletos,
} from "../lib/firebaseService";

interface UserDetails {
  docType: string;
  docNumber: string;
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  email?: string;
}

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [purchasedDetails, setPurchasedDetails] = useState<{
    name: string;
    tickets: string[];
    email: string;
    reference?: string;
    bankName?: string;
  } | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tempCheckoutDetails, setTempCheckoutDetails] = useState<UserDetails | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [bcvRate, setBcvRate] = useState(36.85); // Tasa por defecto como fallback

  const [soldNumbers, setSoldNumbers] = useState<string[]>([]);
  const [reservedNumbers, setReservedNumbers] = useState<string[]>([]);

  const [downloading, setDownloading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const receiptRef = React.useRef<HTMLDivElement>(null);

  // Auditar consistencia y auto-reparar boletos si es necesario al iniciar la página
  React.useEffect(() => {
    const runAudit = async () => {
      try {
        await verificarYRepararBoletos();
      } catch (error) {
        console.error("Error al ejecutar la auditoría de boletos:", error);
      } finally {
        setInitializing(false);
      }
    };
    runAudit();
  }, []);

  React.useEffect(() => {
    const fetchBcvRate = async () => {
      try {
        const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.promedio === "number" && data.promedio > 0) {
            setBcvRate(data.promedio);
          }
        }
      } catch (error) {
        console.error("Error al consultar la tasa oficial del BCV:", error);
      }
    };

    fetchBcvRate();
  }, []);

  // Suscribirnos a los boletos en tiempo real
  React.useEffect(() => {
    const unsubscribe = suscribirBoletos((boletos) => {
      const sold: string[] = [];
      const reserved: string[] = [];

      Object.entries(boletos).forEach(([num, data]) => {
        if (data.estado === "vendido") {
          sold.push(num);
        } else if (data.estado === "reservado") {
          reserved.push(num);
        }
      });

      setSoldNumbers(sold.sort());
      setReservedNumbers(reserved.sort());
    });

    return () => unsubscribe();
  }, []);

  const handleToggleNumber = (num: string) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else {
      setSelectedNumbers((prev) => [...prev, num].sort());
    }
  };

  const handleSelectRandom = (count: number) => {
    // Generar lista de números disponibles de los 200 boletos
    const available = Array.from({ length: 200 }, (_, i) =>
      String(i + 1).padStart(3, "0")
    ).filter((num) => !soldNumbers.includes(num) && !selectedNumbers.includes(num));

    if (available.length === 0) return;

    // Tomar n números al azar
    const randomSelection: string[] = [];
    const countToTake = Math.min(count, available.length);

    for (let i = 0; i < countToTake; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const selected = available.splice(randomIndex, 1)[0];
      randomSelection.push(selected);
    }

    setSelectedNumbers((prev) => [...prev, ...randomSelection].sort());
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleCheckout = (details: UserDetails) => {
    // Al pasar validaciones iniciales, abrir el modal de datos de transferencia Pago Móvil
    setTempCheckoutDetails(details);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentDetails: {
    bankCode: string;
    reference: string;
    receiptFile: File | null;
  }) => {
    if (!tempCheckoutDetails || !paymentDetails.receiptFile) return;
    setPaymentSubmitting(true);

    try {
      const selectedBank = VENEZUELAN_BANKS.find((b) => b.code === paymentDetails.bankCode);
      const bankName = selectedBank ? selectedBank.bank : "Desconocido";

      // Ejecutar registro de compra atómico en Firebase
      await registrarCompra(
        {
          docType: tempCheckoutDetails.docType,
          docNumber: tempCheckoutDetails.docNumber,
          firstName: tempCheckoutDetails.firstName,
          lastName: tempCheckoutDetails.lastName,
          phonePrefix: tempCheckoutDetails.phonePrefix,
          phoneNumber: tempCheckoutDetails.phoneNumber,
          email: tempCheckoutDetails.email || undefined,
        },
        selectedNumbers,
        {
          bankCode: paymentDetails.bankCode,
          bankName: bankName,
          reference: paymentDetails.reference,
          totalUSD: selectedNumbers.length * 10.00,
          totalVES: selectedNumbers.length * 10.00 * bcvRate,
        },
        paymentDetails.receiptFile
      );

      setPurchasedDetails({
        name: `${tempCheckoutDetails.firstName} ${tempCheckoutDetails.lastName}`,
        tickets: [...selectedNumbers],
        email: tempCheckoutDetails.email || "No provisto",
        reference: paymentDetails.reference,
        bankName: bankName,
      });

      setSelectedNumbers([]);
      setPurchaseCompleted(true);
      setTempCheckoutDetails(null);
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      console.error("Error al procesar el pago en Firebase:", error);
      alert(`Error al registrar la compra: ${error.message || "Por favor, inténtalo de nuevo."}`);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleResetPurchase = () => {
    setPurchaseCompleted(false);
    setPurchasedDetails(null);
  };

  const handleDownloadReceipt = () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    import("html-to-image").then(({ toPng }) => {
      toPng(receiptRef.current!, {
        cacheBust: true,
        style: {
          transform: "scale(1)",
          backgroundColor: "#18181b", // Asegura fondo zinc-900 en la exportación
        },
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `comprobante-rifas-facilito-${purchasedDetails?.reference || "pago"}.png`;
          link.href = dataUrl;
          link.click();
          setDownloading(false);
        })
        .catch((err) => {
          console.error("Error al generar imagen de recibo:", err);
          setDownloading(false);
        });
    });
  };

  const handleShare = () => {
    const shareData = {
      title: "Rifas Facilito",
      text: "¡Hola! Ya estoy participando en la Gran Rifa Solidaria de Rifas Facilito. ¡Apóyanos adquiriendo tus boletos en línea y comparte la iniciativa!",
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log("Error al compartir:", err));
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  // Cabecera Simple Minimalista
  const HeaderComponent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎟️</span>
        <span className="font-mono font-black text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
          RIFAS FACILITO
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-zinc-500">
        <button
          onClick={() => setIsPrizeModalOpen(true)}
          className="hover:text-zinc-300 transition-colors cursor-pointer outline-none font-semibold text-xs"
        >
          Premios
        </button>
        <a href="#boletos" className="hover:text-zinc-300 transition-colors">Elegir Números</a>
        <span className="text-zinc-800">|</span>
        <span className="text-amber-500 font-bold">1 Boleto = $10.00 USD (a tasa BCV)</span>
      </div>
    </div>
  );

  // Footer Simple
  const FooterComponent = (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <span>© 2026 Rifas Facilito. Todos los derechos reservados.</span>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIsTermsModalOpen(true)}
          className="hover:text-zinc-400 transition-colors cursor-pointer outline-none"
        >
          Términos y Condiciones
        </button>
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="hover:text-zinc-400 transition-colors cursor-pointer outline-none"
        >
          Política de Privacidad
        </button>
        <a
          href="https://wa.me/584121328143"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-400 transition-colors"
        >
          Soporte por WhatsApp
        </a>
      </div>
    </div>
  );

  if (purchaseCompleted && purchasedDetails) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg flex flex-col gap-5 animate-in zoom-in-95 duration-350">
          
          {/* Tarjeta descargable del Comprobante */}
          <div
            ref={receiptRef}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden"
          >
            {/* Indicador de Línea superior premium */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-350 to-amber-500" />

            {/* Icono de Check de Éxito */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shadow-lg shadow-emerald-500/5">
              ✓
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                ¡Compra Confirmada!
              </h1>
              <p className="text-sm text-zinc-400 px-2">
                Gracias, <strong>{purchasedDetails.name}</strong>. Tu pedido ha sido procesado de manera segura.
              </p>
            </div>

            {/* Caja con detalles de los boletos comprados */}
            <div className="w-full bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 text-left">
              <div>
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Tus números reservados
                </span>
                <div className="flex flex-wrap gap-2">
                  {purchasedDetails.tickets.map((ticket) => (
                    <span
                      key={ticket}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm font-bold shadow-sm"
                    >
                      #{ticket}
                    </span>
                  ))}
                </div>
              </div>

              {purchasedDetails.reference && purchasedDetails.bankName && (
                <div className="border-t border-zinc-900 pt-3 text-xs text-zinc-400 flex flex-col gap-1">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Reporte de Pago
                  </span>
                  <p>🏦 Banco de Origen: <strong className="text-zinc-200">{purchasedDetails.bankName}</strong></p>
                  <p>🔢 Referencia: <strong className="text-zinc-200">{purchasedDetails.reference}</strong></p>
                </div>
              )}

              <div className="border-t border-zinc-900 pt-3 flex flex-col gap-1 text-xs text-zinc-500">
                <p>✉ Detalles enviados a: <strong>{purchasedDetails.email}</strong></p>
                <p>📱 Nos pondremos en contacto contigo vía WhatsApp para verificar el pago y coordinar.</p>
              </div>
            </div>

            {/* Pie del Recibo */}
            <div className="text-[10px] font-mono text-zinc-650 font-bold uppercase tracking-widest mt-2">
              Rifas Facilito
            </div>
          </div>

          {/* Panel de Botones de Acción (Fuera de la tarjeta para no salir en la imagen descargada) */}
          <div className="flex flex-col gap-3 w-full px-1">
            
            {/* Botón Descargar Comprobante */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="py-3 flex items-center justify-center gap-2 border-zinc-800 hover:border-amber-500/35 text-zinc-300 hover:text-amber-400"
            >
              <span>{downloading ? "⏳ Generando Imagen..." : "⬇ Guardar Comprobante como Imagen"}</span>
            </Button>

            {/* Botón de Soporte WhatsApp */}
            <a
              href={`https://wa.me/584121328143?text=Hola%2C%20soy%20${encodeURIComponent(purchasedDetails.name)}.%20Acabo%20de%20comprar%20boletos%20en%20Rifas%20Facilito%20con%20la%20referencia%20${purchasedDetails.reference}.%20Adjunto%20comprobante.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] border border-emerald-800/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 text-center"
            >
              💬 Contactar Soporte WhatsApp
            </a>

            {/* Botones Secundarios: Volver y Compartir */}
            <div className="flex items-center gap-3 w-full mt-1">
              <Button
                variant="outline"
                className="w-1/2 py-2.5 text-xs border-zinc-850 hover:bg-zinc-950 text-zinc-400"
                onClick={handleResetPurchase}
              >
                Volver al Inicio
              </Button>

              <Button
                variant="gradient"
                className="w-1/2 py-2.5 text-xs flex items-center justify-center gap-1.5"
                onClick={handleShare}
              >
                <span>{shareCopied ? "✓ Enlace Copiado" : "📢 Compartir Web"}</span>
              </Button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  if (initializing) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Spinner premium dorado */}
          <div className="relative w-16 h-16 flex items-center justify-center animate-spin duration-[1.5s]">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-900" />
            <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-amber-500/30 border-b-transparent border-l-transparent" />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <h3 className="font-mono font-black text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-350 uppercase">
              RIFAS FACILITO
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
              Cargando boletos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RaffleTemplate
        header={HeaderComponent}
        prizeHero={
          <PrizeHero
            title="Gran Rifa Solidaria: Unidos por nuestra familia"
            description="Hoy nos unimos como familia para superar un momento difícil e imprevisto. Organizamos esta rifa con el objetivo de recaudar fondos destinados a cubrir honorarios legales y gastos derivados de una situación que estamos enfrentando juntos. Agradecemos de corazón cada aporte, mensaje de aliento y apoyo para compartir esta iniciativa."
            prizeName="Una Vaca de Finca (Novilla)"
            pricePerTicket={10.00}
            drawDate="Sábado, 3 de Octubre de 2026"
            drawMethod="Transmisión en vivo vía TikTok"
            targetDate="2026-10-03T20:00:00-04:00"
            priceNote="A tasa BCV"
            soldCount={soldNumbers.length + reservedNumbers.length}
            totalCount={200}
            onShowPrizeDetails={() => setIsPrizeModalOpen(true)}
          />
        }
        ticketGrid={
          <TicketGrid
            selectedNumbers={selectedNumbers}
            soldNumbers={soldNumbers.concat(reservedNumbers)}
            onToggleNumber={handleToggleNumber}
            onSelectRandom={handleSelectRandom}
            totalTickets={200}
          />
        }
        checkoutForm={
          <CheckoutForm
            selectedNumbers={selectedNumbers}
            pricePerTicket={10.00}
            onClear={handleClearSelection}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
          />
        }
        footer={FooterComponent}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalUSD={selectedNumbers.length * 10.00}
        bcvRate={bcvRate}
        selectedTickets={selectedNumbers}
        onSubmitPayment={handlePaymentSubmit}
        isSubmitting={paymentSubmitting}
      />

      <PrizeModal
        isOpen={isPrizeModalOpen}
        onClose={() => setIsPrizeModalOpen(false)}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
