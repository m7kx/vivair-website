"use client"

/**
 * PartnersCarousel
 * ─────────────────────────────────────────────────────────────
 * Seção modular de logos de parceiros com rolagem infinita.
 *
 * Para REMOVER do site: basta comentar <PartnersCarousel /> em page.tsx.
 * Para OCULTAR temporariamente: adicione hidden={true} como prop.
 * ─────────────────────────────────────────────────────────────
 */

interface Props {
  hidden?: boolean
}

const partners = [
  { name: 'Expedia',          file: 'expedia.svg'        },
  { name: 'Club Med',         file: 'clubmed.svg'        },
  { name: 'Norwegian',        file: 'ncl.svg'            },
  { name: 'Royal Caribbean',  file: 'royalcaribbean.svg' },
  { name: 'Costa Cruzeiros',  file: 'costa.svg'          },
  { name: 'MSC Cruises',      file: 'msc.svg'            },
  { name: 'Civitatis',        file: 'civitatis.svg'      },
  { name: 'Beto Carrero',     file: 'beto.svg'           },
]

// 3 cópias → animação -33.333% = exatamente 1 set completo
const track = [...partners, ...partners, ...partners]

export default function PartnersCarousel({ hidden = false }: Props) {
  if (hidden) return null

  return (
    <section style={{
      background: '#ffffff',
      padding: '52px 0 44px',
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
        color: '#BBBBBB',
        marginBottom: 32,
      }}>
        Parceiros Oficiais
      </p>

      {/* Track wrapper com fade lateral */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 100,
          background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 100,
          background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Track — 3 cópias, translação -33.33% = 1 set */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'partnersScroll 28s linear infinite',
          willChange: 'transform',
          width: 'max-content',
        }}>
          {track.map((p, i) => (
            <div key={i} style={{
              flex: '0 0 auto',
              width: 200,
              height: 60,
              marginRight: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${p.file}`}
                alt={p.name}
                width={200}
                height={60}
                style={{
                  width: 200,
                  height: 60,
                  objectFit: 'contain',
                  display: 'block',
                  opacity: 0.5,
                  transition: 'opacity 0.3s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.5' }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partnersScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.3333%); }
        }
      `}</style>
    </section>
  )
}
