"use client"
import React from 'react'

const partners = [
  { name: 'Expedia',           file: 'expedia.svg'        },
  { name: 'Club Med',          file: 'clubmed.svg'        },
  { name: 'Norwegian',         file: 'ncl.svg'            },
  { name: 'Royal Caribbean',   file: 'royalcaribbean.svg' },
  { name: 'Costa Cruzeiros',   file: 'costa.svg'          },
  { name: 'MSC Cruises',       file: 'msc.svg'            },
  { name: 'Civitatis',         file: 'civitatis.svg'      },
  { name: 'Beto Carrero',      file: 'beto.svg'           },
]

// Duplicate 3× so loop is always filled regardless of screen width
const track = [...partners, ...partners, ...partners]

export default function PartnersCarousel() {
  return (
    <section style={{
      background: '#ffffff',
      padding: '60px 0 52px',
      borderTop: '1px solid #EEEBE5',
      borderBottom: '1px solid #EEEBE5',
      overflow: 'hidden',
    }}>
      {/* Label */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--nav-font, Arial, sans-serif)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: '#AAAAAA',
        marginBottom: 32,
      }}>
        Parceiros Oficiais
      </p>

      {/* Track wrapper */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fade masks */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 140,
          background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 140,
          background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Scrolling strip — 3 copies, animate -33.333% */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          /* Each logo slot: 200px + 64px gap = 264px. 8 logos = 2112px. -33.33% = -1 set */
          animation: 'partnersScroll 32s linear infinite',
          willChange: 'transform',
          width: 'max-content',
        }}>
          {track.map((p, i) => (
            <div key={i} style={{
              width: 200,
              marginRight: 64,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${p.file}`}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0.45,
                  transition: 'opacity 0.35s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.45' }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partnersScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
      `}</style>
    </section>
  )
}
