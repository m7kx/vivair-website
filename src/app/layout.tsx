import type { Metadata } from "next"
import { DM_Sans, Outfit, DM_Serif_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import SmoothScrollProvider from "@/components/SmoothScrollProvider"
import CustomCursor from "@/components/CustomCursor"
import FloatingLogo from "@/components/FloatingLogo"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
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
        className={`${dmSans.variable} ${outfit.variable} ${dmSerifDisplay.variable}`}
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
