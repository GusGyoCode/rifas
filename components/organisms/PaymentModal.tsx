"use client";

import React, { useState, useRef } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalUSD: number;
  bcvRate: number;
  selectedTickets: string[];
  onSubmitPayment: (paymentDetails: {
    bankCode: string;
    reference: string;
    receiptFile: File | null;
  }) => void;
  isSubmitting?: boolean;
}

export const VENEZUELAN_BANKS = [
  { "code": "0102", "bank": "BANCO DE VENEZUELA" },
  { "code": "0104", "bank": "BANCO VENEZOLANO DE CREDITO" },
  { "code": "0105", "bank": "BANCO MERCANTIL" },
  { "code": "0108", "bank": "BBVA PROVINCIAL" },
  { "code": "0114", "bank": "BANCARIBE" },
  { "code": "0115", "bank": "BANCO EXTERIOR" },
  { "code": "0128", "bank": "BANCO CARONI" },
  { "code": "0134", "bank": "BANESCO" },
  { "code": "0137", "bank": "BANCO SOFITASA" },
  { "code": "0138", "bank": "BANCO PLAZA" },
  { "code": "0146", "bank": "BANGENTE" },
  { "code": "0151", "bank": "BANCO FONDO COMUN" },
  { "code": "0156", "bank": "100% BANCO" },
  { "code": "0157", "bank": "DELSUR BANCO UNIVERSAL" },
  { "code": "0163", "bank": "BANCO DEL TESORO" },
  { "code": "0168", "bank": "BANCRECER" },
  { "code": "0169", "bank": "R4 BANCO MICROFINANCIERO C.A." },
  { "code": "0171", "bank": "BANCO ACTIVO" },
  { "code": "0172", "bank": "BANCAMIGA BANCO UNIVERSAL, C.A." },
  { "code": "0173", "bank": "BANCO INTERNACIONAL DE DESARROLLO" },
  { "code": "0174", "bank": "BANPLUS" },
  { "code": "0175", "bank": "BANCO DIGITAL DE LOS TRABAJADORES, BANCO UNIVERSAL" },
  { "code": "0177", "bank": "BANFANB" },
  { "code": "0178", "bank": "N58 BANCO DIGITAL BANCO MICROFINANCIERO S A" },
  { "code": "0191", "bank": "BANCO NACIONAL DE CREDITO" }
];

export default function PaymentModal({
  isOpen,
  onClose,
  totalUSD,
  bcvRate,
  selectedTickets,
  onSubmitPayment,
  isSubmitting = false,
}: PaymentModalProps) {
  const [bankCode, setBankCode] = useState(VENEZUELAN_BANKS[0].code);
  const [reference, setReference] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    reference: "",
    receiptFile: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const totalVES = totalUSD * bcvRate;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setErrors((prev) => ({ ...prev, receiptFile: "" }));

      // Crear preview de la foto
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { reference: "", receiptFile: "" };

    if (!reference.trim()) {
      newErrors.reference = "El número de referencia es obligatorio.";
      isValid = false;
    } else if (reference.trim().length < 4) {
      newErrors.reference = "Debe tener al menos 4 dígitos.";
      isValid = false;
    }

    if (!receiptFile) {
      newErrors.receiptFile = "Debes cargar una foto del comprobante de pago.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitPayment({
        bankCode,
        reference,
        receiptFile,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] z-10 shadow-2xl flex flex-col p-6 md:p-8 animate-in zoom-in-95 duration-250">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-500 hover:text-zinc-300 font-bold text-sm"
          type="button"
        >
          ✕
        </button>

        <div className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Datos de Pago
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Por favor, realiza el Pago Móvil y reporta tu comprobante abajo.
            </p>
          </div>

          {/* Caja de Datos del Pago Móvil (Estilo Recibo) */}
          <div className="bg-zinc-950/80 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2.5 py-1 bg-amber-500/10 border-l border-b border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider rounded-bl-xl">
              Pago Móvil
            </div>

            <div className="flex flex-col gap-1 border-b border-zinc-900 pb-3">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Banco</span>
              <span className="text-sm font-bold text-zinc-200">Banco BNC (0191)</span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div>
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Cédula de Identidad</span>
                <span className="text-sm font-mono font-bold text-zinc-250">V-26.875.206</span>
              </div>
              <button
                onClick={() => handleCopy("26875206", "cédula")}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                type="button"
              >
                {copiedText === "cédula" ? "✓ Copiado" : "📋 Copiar"}
              </button>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div>
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Teléfono</span>
                <span className="text-sm font-mono font-bold text-zinc-250">0424-7333483</span>
              </div>
              <button
                onClick={() => handleCopy("04247333483", "teléfono")}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                type="button"
              >
                {copiedText === "teléfono" ? "✓ Copiado" : "📋 Copiar"}
              </button>
            </div>

            {/* Total a pagar */}
            <div className="flex justify-between items-end pt-2 mt-1 border-t border-zinc-900/60">
              <div>
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Total en Dólares</span>
                <span className="text-base font-black font-mono text-zinc-200">
                  ${totalUSD.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-zinc-500">USD</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total en Bolívares</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black font-mono text-amber-400">
                    Bs. {totalVES.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => {
                      // Copiar el valor formateado a 2 decimales para pegarlo directamente en el Pago Móvil
                      const amountToCopy = (Math.round(totalVES * 100) / 100).toFixed(2).replace(".", ",");
                      handleCopy(amountToCopy, "monto");
                    }}
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                    type="button"
                    title="Copiar monto"
                  >
                    {copiedText === "monto" ? "✓" : "📋"}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-zinc-500 font-semibold font-mono tracking-wide text-right mt-1 border-t border-zinc-900/60 pt-2">
              Tasa Oficial BCV: 1 USD = {bcvRate} VES
            </div>
          </div>

          {/* Formulario de Reporte de Pago */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Banco de Origen */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="bank" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none">
                Banco de Origen *
              </label>
              <select
                id="bank"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-amber-500/20 transition-all duration-200 focus:ring-4 backdrop-blur-sm text-sm font-semibold cursor-pointer"
              >
                {VENEZUELAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Referencia de Pago */}
            <FormField
              label="Referencia de Pago (Últimos 4-6 dígitos) *"
              id="reference"
              name="reference"
              type="text"
              placeholder="Ej. 1234 o 567890"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value.replace(/\D/g, ""));
                if (errors.reference) setErrors((prev) => ({ ...prev, reference: "" }));
              }}
              errorText={errors.reference}
            />

            {/* Comprobante de Pago (Cargar foto) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none">
                Foto del Comprobante *
              </label>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  errors.receiptFile
                    ? "border-rose-500/50 hover:border-rose-500 bg-rose-500/5"
                    : "border-zinc-800 hover:border-amber-550 bg-zinc-950/40"
                } rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {receiptPreview ? (
                  <div className="relative w-full aspect-[16/6] rounded-xl overflow-hidden border border-zinc-850 flex items-center justify-center bg-zinc-950/80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={receiptPreview}
                      alt="Vista previa del comprobante"
                      className="object-contain h-full w-full max-h-[120px]"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-[9px] font-semibold text-zinc-300 rounded border border-zinc-800">
                      Cambiar foto
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-1.5 py-4">
                    <span className="text-2xl">📸</span>
                    <span className="text-xs font-bold text-zinc-300">Cargar Foto de Recibo</span>
                    <span className="text-[10px] text-zinc-500">Formatos soportados: JPG, PNG</span>
                  </div>
                )}
              </div>
              
              {errors.receiptFile && (
                <span className="text-xs text-rose-500 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.receiptFile}
                </span>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                className="w-1/3 py-3"
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                variant="gradient"
                className="w-2/3 py-3"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando Pago..." : "Reportar Pago"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
