import type { Metadata } from "next"
import { Instrument_Serif, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import SmoothScrollProvider from "@/components/SmoothScrollProvider"
import CustomCursor from "@/components/CustomCursor"
import FloatingLogo from "@/components/FloatingLogo"
import "./globals.css"

// — Display font: Instrument Serif (headlines, CTAs, editorial) ————————————

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
})

// — Body/UI font: Outfit (navigation, body, UI elements) ————————————
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "VivAir Travel Design | Viagens Personalizadas",
  description:
    "Desenhamos experiências de viagem com a sua cara. Da inspiração ao embarque, a gente cuida de tudo.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${outfit.variable}`}
        style={{ cursor: "none" }}
      >
        <CustomCursor />
        {/*
          FloatingLogo DEVE estar aqui, diretamente em <body>, ANTES do
          SmoothScrollProvider e de qualquer element com transform do Framer
          Motion. Isso garante que position:fixed funcione corretamente em
          todas as páginas, sem ser afetado por stacking contexts de parallax.
        */}
        <FloatingLogo />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  )
}
