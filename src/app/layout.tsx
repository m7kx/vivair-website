import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

/* ── Fonts ────────────────────────────────────────────────── */
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
})

/* ── Metadata ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: 'VivAir Travel Design — Sua viagem, do seu jeito',
    template: '%s | VivAir Travel Design',
  },
  description:
    'Agência de viagens premium com curadoria personalizada. Cruzeiros, Europa, Disney, experiências corporativas e muito mais. Design the trip of your life.',
  metadataBase: new URL('https://vivairtravel.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vivairtravel.com.br',
    siteName: 'VivAir Travel Design',
    title: 'VivAir Travel Design — Sua viagem, do seu jeito',
    description:
      'Viagens de luxo com curadoria personalizada. Da conversa ao embarque, a gente cuida de tudo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VivAir Travel Design',
    description: 'Viagens de luxo com curadoria personalizada.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a1f44',
  width: 'device-width',
  initialScale: 1,
}

/* ── Root Layout ──────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${dmSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
