"use client";

import React from "react";
import Button from "../atoms/Button";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-y-auto max-h-[80vh] z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-250">
        
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/90 backdrop-blur-md px-6 py-5 border-b border-zinc-850 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <h3 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Política de Privacidad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 font-bold text-sm outline-none"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto text-xs text-zinc-400 leading-relaxed">
          
          {/* Introducción */}
          <p className="text-zinc-300 font-medium">
            En <b>Rifas Facilito</b>, nos tomamos muy en serio la confidencialidad de tus datos. Al ser un sorteo solidario de carácter benéfico y no comercial, recopilamos únicamente la información mínima necesaria para garantizar la transparencia del sorteo y contactar al ganador.
          </p>

          {/* Sección 1: Datos Recopilados */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>📋</span> 1. Información que Recopilamos
            </h4>
            <p>
              Durante el proceso de compra de boletos, solicitamos los siguientes datos personales y de pago:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
              <li><b>Identificación:</b> Nombre, Apellido, Tipo y Número de Documento (Cédula de Identidad).</li>
              <li><b>Contacto:</b> Número de teléfono/WhatsApp y Correo Electrónico (opcional).</li>
              <li><b>Verificación del aporte:</b> Banco de origen, número de referencia de la transferencia y captura de pantalla del comprobante de pago móvil.</li>
            </ul>
          </div>

          {/* Sección 2: Uso de los Datos */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🎯</span> 2. Uso y Finalidad de los Datos
            </h4>
            <p>
              Tus datos se utilizarán única y exclusivamente para:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
              <li>Verificar manualmente que el pago móvil reportado se haya acreditado exitosamente.</li>
              <li>Registrar y asignar a tu nombre los números de boletos reservados.</li>
              <li>Enviar el comprobante digital de compra si proporcionaste un correo electrónico.</li>
              <li>Establecer contacto directo contigo en caso de resultar ganador en la transmisión en vivo.</li>
            </ul>
          </div>

          {/* Sección 3: No compartición */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🛡️</span> 3. Protección y Confidencialidad
            </h4>
            <p>
              **No compartimos, vendemos, alquilamos ni divulgamos tus datos personales** a empresas, anunciantes o terceros para fines comerciales o de marketing. La información es almacenada en servidores seguros proveídos por Google Firebase, bajo estrictas medidas de seguridad y cifrado HTTPS.
            </p>
          </div>

          {/* Sección 4: Retención y Eliminación */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🗑️</span> 4. Conservación de la Información
            </h4>
            <p>
              Los datos personales recopilados para este sorteo se conservarán únicamente durante la vigencia de la rifa. Una vez realizado el sorteo el 3 de octubre de 2026, verificado el pago y entregado el premio, **toda la base de datos de compradores e imágenes de comprobantes será eliminada permanentemente** para salvaguardar la privacidad de todos los participantes.
            </p>
          </div>

          {/* Botón */}
          <div className="mt-4 sticky bottom-0 bg-zinc-900 pt-2 pb-1">
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
