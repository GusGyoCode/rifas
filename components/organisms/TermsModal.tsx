"use client";

import React from "react";
import Button from "../atoms/Button";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-y-auto max-h-[85vh] z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-250">
        
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/90 backdrop-blur-md px-6 py-5 border-b border-zinc-850 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <h3 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Términos y Condiciones
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
          
          {/* Sección 1: Propósito */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🤝</span> 1. Carácter Solidario y No Comercial
            </h4>
            <p>
              Esta iniciativa es una actividad privada de recaudación benéfica organizada estrictamente con **fines de ayuda familiar**, destinada a cubrir honorarios legales y gastos conexos derivados de una situación imprevista. **No tiene carácter mercantil ni fines comerciales**. Los organizadores declinan toda responsabilidad penal o civil derivada del mal uso del sitio web o de la información por parte de terceros.
            </p>
          </div>

          {/* Sección 2: No devoluciones */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🚫</span> 2. Política de No Devolución
            </h4>
            <p>
              Una vez completada la reserva del boleto y reportado el pago, **bajo ninguna circunstancia se realizarán reembolsos, cancelaciones o devoluciones del dinero**. Al participar, declaras que tu aporte es voluntario y definitivo.
            </p>
          </div>

          {/* Sección 3: Fraudes */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🔒</span> 3. Prevención de Fraude y Pagos Fallidos
            </h4>
            <p>
              Todos los pagos reportados son verificados de forma manual en las cuentas receptoras. Si se detecta un **comprobante alterado, falso, duplicado o si la transferencia no se hace efectiva en el banco de destino**, la reserva será anulada inmediatamente. Los boletos correspondientes se liberarán de forma automática para quedar disponibles nuevamente para el público.
            </p>
          </div>

          {/* Sección 4: Datos del Ganador */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>🎯</span> 4. Reclamo del Premio y Datos del Ganador
            </h4>
            <p>
              Es responsabilidad del participante suministrar datos reales y de contacto válidos al momento del checkout (Cédula de Identidad, Nombre, Apellido y Teléfono). 
            </p>
            <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
              <li>
                <b>Verificación de Identidad:</b> Para reclamar el premio (la novilla o el dinero), el ganador debe presentar su **Cédula de Identidad física original** que coincida exactamente con los datos registrados en el boleto.
              </li>
              <li>
                <b>Datos Erróneos o Inlocalizables:</b> Si los datos proporcionados son falsos, incorrectos o si resulta imposible contactar al ganador en un plazo de **15 días continuos** posterior al sorteo, se anulará su boleto y **se procederá a realizar el sorteo nuevamente** para obtener un segundo ganador.
              </li>
            </ul>
          </div>

          {/* Sección 5: Modificación de Fechas */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-850/60 pt-4">
            <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
              <span>📅</span> 5. Fuerza Mayor, Meta de Ventas y Modificación del Sorteo
            </h4>
            <p>
              El sorteo se transmitirá de forma transparente a través de la plataforma TikTok Live en la fecha señalada. Los organizadores se reservan el derecho de modificar la fecha o la hora de la transmisión por **razones de fuerza mayor, problemas técnicos de la plataforma o causas legales sobrevenidas**. 
            </p>
            <p className="mt-1 font-semibold text-zinc-300">
              ⚠️ Condición de Ventas Mínimas: Se establece como requisito indispensable para la realización del sorteo la venta de al menos el 85% del total de boletos emitidos (equivalente a 170 boletos). Si no se ha alcanzado esta meta de recaudación mínima para la fecha pautada, los organizadores postergarán y reprogramarán la fecha del sorteo de forma sucesiva hasta completar dicho objetivo.
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
              Aceptar y Cerrar
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
