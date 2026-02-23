import React from 'react'

const partners = [
  { name: 'Expedia',            file: 'expedia.svg'        },
  { name: 'Club Med',           file: 'clubmed.svg'        },
  { name: 'Norwegian',          file: 'ncl.svg'            },
  { name: 'Royal Caribbean',    file: 'royalcaribbean.svg' },
  { name: 'Costa Cruzeiros',    file: 'costa.svg'          },
  { name: 'MSC Cruises',        file: 'msc.svg'            },
  { name: 'Civitatis',          file: 'civitatis.svg'      },
  { name: 'Beto Carrero',       file: 'beto.svg'           },
]

export default function PartnersCarousel() {
  // Duplicate the list for seamless infinite scroll
  const track = [...partners, ...partners]

  return (
    <section style={{
      background: '#ffffff',
      padding: '64px 0 56px',
      borderTop: '1px solid #F0EDE8',
      borderBottom: '1px solid #F0EDE8',
      overflow: 'hidden',
    }}>
      {/* Heading */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--nav-font)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#999',
        marginBottom: 36,
      }}>
        Parceiros Oficiais
      </p>

      {/* Scrolling track */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Left fade mask */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
          background: 'linear-gradient(to right, white, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        {/* Right fade mask */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
          background: 'linear-gradient(to left, white, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex',
          gap: 0,
          animation: 'partnersScroll 28s linear infinite',
          width: 'max-content',
        }}>
          {track.map((p, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 48px',
              height: 72,
              flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${p.file}`}
                alt={p.name}
                style={{
                  height: 40,
                  width: 'auto',
                  maxWidth: 160,
                  objectFit: 'contain',
                  filter: 'grayscale(100%) opacity(55%)',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(100%) opacity(55%)')}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partnersScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
