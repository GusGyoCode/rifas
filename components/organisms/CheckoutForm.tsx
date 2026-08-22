"use client";

import React, { useState } from "react";
import FormField from "../molecules/FormField";
import SummaryCard from "../molecules/SummaryCard";
import Input from "../atoms/Input";

interface UserDetails {
  docType: string;
  docNumber: string;
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  email?: string;
}

interface CheckoutFormProps {
  selectedNumbers: string[];
  pricePerTicket: number;
  onClear: () => void;
  onCheckout: (details: UserDetails) => void;
  isSubmitting?: boolean;
}

export default function CheckoutForm({
  selectedNumbers,
  pricePerTicket,
  onClear,
  onCheckout,
  isSubmitting = false,
}: CheckoutFormProps) {
  const [form, setForm] = useState({
    docType: "V",
    docNumber: "",
    firstName: "",
    lastName: "",
    phonePrefix: "+58",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    docNumber: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      docNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    };

    if (!form.docNumber.trim()) {
      newErrors.docNumber = "El documento es obligatorio.";
      isValid = false;
    } else if (form.docNumber.trim().length < 5) {
      newErrors.docNumber = "Ingresa un número de documento válido.";
      isValid = false;
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio.";
      isValid = false;
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "Debe tener al menos 2 letras.";
      isValid = false;
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Debe tener al menos 2 letras.";
      isValid = false;
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "El teléfono es obligatorio.";
      isValid = false;
    } else if (form.phoneNumber.replace(/\s/g, "").length < 7) {
      newErrors.phoneNumber = "Debe tener al menos 7 dígitos.";
      isValid = false;
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Ingresa un correo válido.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, docNumber: value }));
    if (errors.docNumber) {
      setErrors((prev) => ({ ...prev, docNumber: "" }));
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s-]/g, "");
    setForm((prev) => ({ ...prev, phoneNumber: value }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const handleSubmit = () => {
    if (selectedNumbers.length === 0) return;
    if (validate()) {
      onCheckout({
        docType: form.docType,
        docNumber: form.docNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        phonePrefix: form.phonePrefix,
        phoneNumber: form.phoneNumber,
        email: form.email.trim() ? form.email : undefined,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Datos del Comprador Formulario */}
      {selectedNumbers.length > 0 && (
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
          <h3 className="font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <span>👤</span> Datos del Comprador
          </h3>
          <div className="flex flex-col gap-4">
            
            {/* Documento de Identidad (Cédula) */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="docNumber" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none">
                Documento de Identidad *
              </label>
              <div className="flex gap-2">
                <select
                  id="docType"
                  name="docType"
                  value={form.docType}
                  onChange={handleSelectChange}
                  className="rounded-xl bg-zinc-900/50 border border-zinc-850 px-3 py-3 text-zinc-300 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-amber-500/20 transition-all duration-200 focus:ring-4 backdrop-blur-sm text-sm font-bold cursor-pointer"
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                  <option value="J">J</option>
                </select>
                <Input
                  id="docNumber"
                  name="docNumber"
                  placeholder="Ej. 12345678"
                  value={form.docNumber}
                  onChange={handleNumberInput}
                  error={!!errors.docNumber}
                />
              </div>
              {errors.docNumber && (
                <span className="text-xs text-rose-500 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.docNumber}
                </span>
              )}
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Nombre *"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Ej. Gustavo"
                value={form.firstName}
                onChange={handleChange}
                errorText={errors.firstName}
              />
              <FormField
                label="Apellido *"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Ej. Morales"
                value={form.lastName}
                onChange={handleChange}
                errorText={errors.lastName}
              />
            </div>

            {/* Teléfono con prefijo de código de país */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none">
                Teléfono / WhatsApp *
              </label>
              <div className="flex gap-2">
                <select
                  id="phonePrefix"
                  name="phonePrefix"
                  value={form.phonePrefix}
                  onChange={handleSelectChange}
                  className="rounded-xl bg-zinc-900/50 border border-zinc-850 px-3.5 py-3 text-zinc-300 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-amber-500/20 transition-all duration-200 focus:ring-4 backdrop-blur-sm text-sm font-semibold cursor-pointer min-w-[110px]"
                >
                  <option value="+58">+58 (VE)</option>
                  <option value="+57">+57 (CO)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+34">+34 (ES)</option>
                  <option value="+51">+51 (PE)</option>
                  <option value="+56">+56 (CL)</option>
                  <option value="+54">+54 (AR)</option>
                  <option value="+52">+52 (MX)</option>
                  <option value="+593">+593 (EC)</option>
                </select>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Ej. 412 1234567"
                  value={form.phoneNumber}
                  onChange={handlePhoneInput}
                  error={!!errors.phoneNumber}
                />
              </div>
              {errors.phoneNumber && (
                <span className="text-xs text-rose-500 font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            {/* Correo Electrónico (Opcional) */}
            <FormField
              label="Correo Electrónico (Opcional)"
              id="email"
              name="email"
              type="email"
              placeholder="Ej. gustavo@example.com"
              value={form.email}
              onChange={handleChange}
              errorText={errors.email}
            />

          </div>
        </div>
      )}

      {/* Tarjeta de Resumen y Botón de Pago */}
      <SummaryCard
        selectedNumbers={selectedNumbers}
        pricePerTicket={pricePerTicket}
        onClear={onClear}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
