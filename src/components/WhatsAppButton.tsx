"use client"

/**
 * WhatsAppButton
 * ─────────────────────────────────────────────────────────────
 * Botão flutuante de contato via WhatsApp.
 * Modular — para remover: comente <WhatsAppButton /> em page.tsx.
 *
 * Design: champagne gradient (coerente com as CTAs do site).
 *   Mobile  → círculo 56px com ícone apenas
 *   Desktop → pílula com ícone + texto "Fale conosco"
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'

const WA_URL = 'https://wa.me/5521996832196?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20desenhar%20minha%20viagem%20%F0%9F%9A%80'

interface Props {
  hidden?: boolean
}

export default function WhatsAppButton({ hidden = false }: Props) {
  const [hovered, setHovered] = useState(false)

  if (hidden) return null

  return (
    <>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #C4A35A 0%, #D4A574 50%, #C9856B 100%)',
          borderRadius: 100,
          padding: '0 20px 0 16px',
          height: 56,
          minWidth: 56,
          boxShadow: hovered
            ? '0 8px 32px rgba(196,163,90,0.45), 0 2px 8px rgba(0,0,0,0.15)'
            : '0 4px 20px rgba(196,163,90,0.30), 0 2px 8px rgba(0,0,0,0.10)',
          textDecoration: 'none',
          transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        {/* WhatsApp icon SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            fill="white"
          />
          <path
            d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.89.522 3.66 1.427 5.18L2 22l4.945-1.407A9.959 9.959 0 0012.004 22c5.527 0 10-4.473 10-10s-4.473-10-10-10z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* Texto — visível apenas em telas >= 640px */}
        <span style={{
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'var(--p-font-primary, sans-serif)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          // Mobile: esconder texto, manter só ícone
          display: 'none',
        }}
          className="wa-label"
        >
          Fale conosco
        </span>
      </a>

      {/* Mostrar label a partir de 640px */}
      <style>{`
        @media (min-width: 640px) {
          .wa-label { display: block !important; }
        }
      `}</style>
    </>
  )
}
