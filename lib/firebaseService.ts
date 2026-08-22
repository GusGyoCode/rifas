import {
  collection,
  doc,
  getDocs,
  writeBatch,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { convertToWebP } from "./imageUtils";

// Interfaces de TypeScript
export interface Comprador {
  docType: string;
  docNumber: string;
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  email?: string;
  createdAt?: FieldValue;
}

export interface Pago {
  compradorId: string;
  boletos: string[];
  bancoOrigen: string;
  bancoOrigenNombre: string;
  referencia: string;
  comprobanteUrl: string;
  montoUSD: number;
  montoVES: number;
  estado: "pendiente" | "aprobado" | "rechazado";
  createdAt?: FieldValue;
}

export interface Boleto {
  estado: "disponible" | "reservado" | "vendido";
  compradorId: string | null;
  pagoId: string | null;
  updatedAt?: FieldValue;
}

/**
 * Inicializa los 200 boletos en la base de datos Firestore
 * si es que aún no se han creado (del 000 al 199).
 */
export const inicializarBoletosSiNoExisten = async (): Promise<void> => {
  try {
    const boletosColRef = collection(db, "boletos");
    const snapshot = await getDocs(boletosColRef);

    if (snapshot.empty) {
      console.log("Inicializando colección de 200 boletos en Firestore...");
      const batch = writeBatch(db);

      for (let i = 0; i < 200; i++) {
        const numStr = String(i).padStart(3, "0");
        const docRef = doc(db, "boletos", numStr);
        batch.set(docRef, {
          estado: "disponible",
          compradorId: null,
          pagoId: null,
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
      console.log("Inicialización exitosa.");
    }
  } catch (error) {
    console.error("Error al inicializar la colección de boletos:", error);
  }
};

/**
 * Suscribe a los cambios de la colección de boletos en tiempo real.
 */
export const suscribirBoletos = (
  callback: (boletos: Record<string, Boleto>) => void
) => {
  const boletosColRef = collection(db, "boletos");
  
  return onSnapshot(
    boletosColRef,
    (snapshot) => {
      const boletos: Record<string, Boleto> = {};
      snapshot.forEach((doc) => {
        boletos[doc.id] = doc.data() as Boleto;
      });
      callback(boletos);
    },
    (error) => {
      console.error("Error al suscribirse a los boletos en Firestore:", error);
    }
  );
};

/**
 * Registra los datos del participante, sube el comprobante de pago y reserva los boletos seleccionados.
 * Todo el registro en base de datos se realiza bajo una transacción atómica.
 */
export const registrarCompra = async (
  comprador: Comprador,
  boletosSeleccionados: string[],
  pagoInfo: {
    bankCode: string;
    bankName: string;
    reference: string;
    totalUSD: number;
    totalVES: number;
  },
  archivoComprobante: File
): Promise<void> => {
  // 1. Convertir archivo a WebP (con fallback al original en caso de error)
  let webpFile = archivoComprobante;
  let fileExtension = "webp";
  
  try {
    webpFile = await convertToWebP(archivoComprobante);
  } catch (error) {
    console.warn("No se pudo convertir la imagen a WebP, subiendo formato original:", error);
    fileExtension = archivoComprobante.name.split(".").pop() || "png";
  }

  // 2. Subir archivo a Firebase Storage
  const storagePath = `comprobantes/${pagoInfo.reference}_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, webpFile);
  const comprobanteUrl = await getDownloadURL(storageRef);

  // 2. Transacción atómica en Firestore
  await runTransaction(db, async (transaction) => {
    // Validar disponibilidad de los boletos seleccionados
    for (const num of boletosSeleccionados) {
      const boletoRef = doc(db, "boletos", num);
      const boletoSnap = await transaction.get(boletoRef);

      if (!boletoSnap.exists()) {
        throw new Error(`El boleto #${num} no existe.`);
      }

      const data = boletoSnap.data() as Boleto;
      if (data.estado !== "disponible") {
        throw new Error(`El boleto #${num} ya no está disponible.`);
      }
    }

    // Registrar Comprador (ID único: Tipo + Número de documento)
    const compradorId = `${comprador.docType}${comprador.docNumber}`;
    const compradorRef = doc(db, "compradores", compradorId);
    transaction.set(compradorRef, {
      ...comprador,
      createdAt: serverTimestamp(),
    });

    // Registrar Reporte de Pago
    const pagoRef = doc(collection(db, "pagos"));
    const pagoId = pagoRef.id;
    transaction.set(pagoRef, {
      compradorId,
      boletos: boletosSeleccionados,
      bancoOrigen: pagoInfo.bankCode,
      bancoOrigenNombre: pagoInfo.bankName,
      referencia: pagoInfo.reference,
      comprobanteUrl,
      montoUSD: pagoInfo.totalUSD,
      montoVES: pagoInfo.totalVES,
      estado: "pendiente",
      createdAt: serverTimestamp(),
    } as Pago);

    // Reservar boletos
    for (const num of boletosSeleccionados) {
      const boletoRef = doc(db, "boletos", num);
      transaction.update(boletoRef, {
        estado: "reservado",
        compradorId,
        pagoId,
        updatedAt: serverTimestamp(),
      });
    }
  });

  // 3. Enviar notificación a Telegram (fuera de la transacción de base de datos)
  try {
    await enviarNotificacionTelegram(comprador, boletosSeleccionados, pagoInfo, comprobanteUrl);
  } catch (error) {
    console.error("Error al enviar la notificación a Telegram:", error);
  }
};

/**
 * Envía una notificación formateada en HTML a un canal de Telegram privado.
 */
export const enviarNotificacionTelegram = async (
  comprador: Comprador,
  boletos: string[],
  pagoInfo: {
    bankCode: string;
    bankName: string;
    reference: string;
    totalUSD: number;
    totalVES: number;
  },
  comprobanteUrl: string
): Promise<void> => {
  const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Variables de entorno de Telegram no configuradas.");
    return;
  }

  const boletosStr = boletos.map((num) => `#${num}`).join(", ");
  const fechaStr = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

  const text = `🚨 <b>¡NUEVO PAGO REPORTADO!</b> 🚨\n\n` +
    `👤 <b>Cliente:</b> ${comprador.firstName} ${comprador.lastName} (${comprador.docType}-${comprador.docNumber})\n` +
    `📱 <b>Teléfono:</b> ${comprador.phonePrefix} ${comprador.phoneNumber}\n` +
    `✉️ <b>Correo:</b> ${comprador.email || "No provisto"}\n\n` +
    `🎟️ <b>Boletos Reservados:</b>\n` +
    `<code>${boletosStr}</code> (Total: ${boletos.length} boletos)\n\n` +
    `💰 <b>Monto del Pago:</b>\n` +
    `• <b>USD:</b> $${pagoInfo.totalUSD.toLocaleString("es-CO", { minimumFractionDigits: 2 })}\n` +
    `• <b>VES:</b> Bs. ${pagoInfo.totalVES.toLocaleString("es-VE", { minimumFractionDigits: 2 })}\n\n` +
    `🏦 <b>Banco de Origen:</b> ${pagoInfo.bankName} (${pagoInfo.bankCode})\n` +
    `🔢 <b>Referencia:</b> <code>${pagoInfo.reference}</code>\n` +
    `📄 <a href="${comprobanteUrl}">Ver Comprobante de Pago</a>\n\n` +
    `<i>Reportado el: ${fechaStr}</i>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error devuelto por la API de Telegram:", errorData);
    }
  } catch (err) {
    console.error("Error al conectar con la API de Telegram:", err);
  }
};
