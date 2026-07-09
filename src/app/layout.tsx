import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/shared/sonner";
import { AppProvider } from "@/context/app-context"
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
  metadataBase: new URL("https://oratos.com.br"),
  title: {
    default: "Oratos",
    template: "%s | Oratos",
  },
  description: "Sistema operacional com IA para gestão empresarial.",
  openGraph: {
    title: "Oratos",
    description: "Sistema operacional com IA para gestão empresarial.",
    url: "https://oratos.com.br",
    siteName: "Oratos",
    images: [
      {
        url: "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/link_preview.png",
        width: 1200,
        height: 630,
        alt: "Oratos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oratos",
    description: "Sistema operacional com IA para gestão empresarial.",
    images: [
      "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/link_preview.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col">
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
      </body>
    </html>
  );
}
