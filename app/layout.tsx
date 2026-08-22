import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rifas Facilito - Gran Rifa Solidaria",
  description: "Apóyanos adquiriendo tus boletos en línea. Todos los fondos recaudados se destinarán a cubrir gastos legales imprevistos de un familiar.",
  openGraph: {
    title: "Rifas Facilito - Gran Rifa Solidaria",
    description: "Apóyanos adquiriendo tus boletos en línea. Todos los fondos recaudados se destinarán a cubrir gastos legales imprevistos de un familiar.",
    type: "website",
    locale: "es_VE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "Rifas Facilito - Gran Rifa Solidaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rifas Facilito - Gran Rifa Solidaria",
    description: "Apóyanos adquiriendo tus boletos en línea. Todos los fondos recaudados se destinarán a cubrir gastos legales imprevistos de un familiar.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
