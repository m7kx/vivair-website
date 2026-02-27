"use client"

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ─── Destinations Data ──────────────────────────────────────────── */
const DESTINATIONS = [
  {
    id: 1,
    name: 'Maldivas',
    country: 'Oceano Índico',
    countryCode: 'mv',
    tag: 'Mais buscado',
    desc: 'Bangalôs sobre a água, recifes de corais e pôr do sol que para o tempo. Para casais e lua de mel.',
    tags: ['Lua de mel', 'Resort', 'All-inclusive'],
    image: '/images/dest-maldivas.jpg',
    gradient: 'linear-gradient(135deg, #0a4f6e 0%, #0a8a8a 100%)',
    accent: '#00d4d4',
  },
  {
    id: 2,
    name: 'Paris',
    country: 'França',
    countryCode: 'fr',
    tag: 'Clássico',
    desc: 'A cidade que nunca sai de moda. Arte, gastronomia e o Sena ao entardecer. Imprescindível.',
    tags: ['Cultura', 'Gastronomia', 'Romântico'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #7c3aed 100%)',
    accent: '#a78bfa',
  },
  {
    id: 3,
    name: 'Dubai',
    country: 'Emirados Árabes',
    countryCode: 'ae',
    tag: 'Premium',
    desc: 'Arranha-céus, desertos dourados e hotéis que redefinem o luxo. Onde o impossível é cotidiano.',
    tags: ['Luxo', 'Aventura', 'Compras'],
    image: '/images/dest-dubai.jpg',
    gradient: 'linear-gradient(135deg, #7c4f00 0%, #c4861a 100%)',
    accent: '#fbbf24',
  },
  {
    id: 4,
    name: 'Tokyo',
    country: 'Japão',
    countryCode: 'jp',
    tag: 'Trending',
    desc: 'Tradição milenar encontra o futuro. Templos, neon, ramen e cerejeiras. Uma experiência de outro mundo.',
    tags: ['Cultura', 'Gastronomia', 'Singular'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
    accent: '#fb7185',
  },
  {
    id: 5,
    name: 'Santorini',
    country: 'Grécia',
    countryCode: 'gr',
    tag: 'Romântico',
    desc: 'Casas brancas sobre o vulcão, caldeira azul e o por do sol mais fotogênico da Europa.',
    tags: ['Romântico', 'Natureza', 'Fotografia'],
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    accent: '#60a5fa',
  },
]

/* ─── Tag Badge ──────────────────────────────────────────────────── */
function TagBadge({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      background: 'rgba(255,255,255,0.12)',
      color: 'rgba(250,249,246,0.75)',
      border: '1px solid rgba(255,255,255,0.15)',
      backdropFilter: 'blur(8px)',
    }}>
      {label}
    </span>
  )
}

/* ─── Destination Row (alternating layout) ──────────────────────── */
function DestinationRow({ dest, index }: { dest: typeof DESTINATIONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Image parallax
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08])

  // Text slide in from opposite side
  const textX = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    isEven ? [80, 0, 0, -30] : [-80, 0, 0, 30]
  )
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0, 1, 1, 0])

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0,
        minHeight: 520,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="destination-row"
    >
      {/* ── Image side ── */}
      <div
        style={{
          order: isEven ? 0 : 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 480,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Parallax image */}
        <motion.div
          style={{
            position: 'absolute', inset: '-15%',
            backgroundImage: `url(${dest.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: imageY,
            scale: imageScale,
            willChange: 'transform',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isEven
            ? 'linear-gradient(90deg, transparent 60%, rgba(10,31,68,0.6) 100%)'
            : 'linear-gradient(270deg, transparent 60%, rgba(10,31,68,0.6) 100%)',
          zIndex: 1,
        }} />
        {/* Dark overlay on hover */}
        <motion.div
          style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(0,0,0,0.15)' }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        {/* Tag badge floating */}
        <motion.div
          style={{
            position: 'absolute',
            top: 24, left: isEven ? 'auto' : 24,
            right: isEven ? 24 : 'auto',
            zIndex: 4,
          }}
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        >
          <span style={{
            background: 'var(--grad-cta)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}>
            {dest.tag}
          </span>
        </motion.div>
      </div>

      {/* ── Content side ── */}
      <motion.div
        style={{
          order: isEven ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 56px',
          background: 'var(--surface-page)',
          x: textX,
          opacity: textOpacity,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Country */}
        <motion.p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: 'var(--on-dark-accent)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.2 }}
        >
          <img
              src={`/images/flags/${dest.countryCode}.svg`}
              width={22}
              height={15}
              style={{ opacity: 0.5, borderRadius: 2, objectFit: 'cover', display: 'inline-block' }}
              alt=""
            />
          {dest.country}
        </motion.p>

        {/* City name */}
        <motion.h3
          style={{
            fontFamily: 'var(--hero-font)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            color: 'var(--text-brand)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 20,
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.3, type: 'spring', stiffness: 100 }}
        >
          {dest.name}
        </motion.h3>

        {/* Description */}
        <motion.p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: 28,
            maxWidth: 380,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.4 }}
        >
          {dest.desc}
        </motion.p>

        {/* Tags */}
        <motion.div
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 36 }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.5 }}
        >
          {dest.tags.map(t => (
            <span key={t} style={{
              padding: '5px 14px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(10,31,68,0.06)',
              color: 'var(--text-brand)',
              border: '1px solid rgba(10,31,68,0.12)',
            }}>
              {t}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.6, type: 'spring', stiffness: 120 }}
        >
          <motion.a
            href="https://wa.me/5521996832196"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--grad-cta)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: 'var(--btn-radius)',
              fontFamily: 'var(--btn-font)',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Quero ir para {dest.name}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .destination-row {
            grid-template-columns: 1fr !important;
          }
          .destination-row > div:first-child {
            order: 0 !important;
            min-height: 280px !important;
          }
          .destination-row > div:last-child {
            order: 1 !important;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ─── Section Header with scroll reveal ─────────────────────────── */
function SectionHeader() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '96px 24px 72px',
      background: 'var(--surface-page)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(196,163,90,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          color: 'var(--on-dark-accent)',
          background: 'var(--surface-dark)',
          display: 'inline-block',
          padding: '6px 20px',
          borderRadius: 100,
          marginBottom: 20,
        }}
      >
        Destinos em alta
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, delay: 0.1, type: 'spring', stiffness: 80 }}
        style={{
          fontFamily: 'var(--hero-font)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          color: 'var(--text-brand)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          maxWidth: 560,
          margin: '0 auto 20px',
        }}
      >
        Para onde o mundo está indo
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 440,
          margin: '0 auto',
        }}
      >
        Os destinos mais desejados pelos nossos clientes. Cada um com roteiro personalizado.
      </motion.p>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function DestinationsSection() {
  return (
    <section id="destinos" style={{ background: 'var(--surface-page)', overflow: 'hidden' }}>
      <SectionHeader />
      <div>
        {DESTINATIONS.map((dest, i) => (
          <DestinationRow key={dest.id} dest={dest} index={i} />
        ))}
      </div>
      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        style={{ textAlign: 'center', padding: '72px 24px 96px', background: 'var(--surface-page)' }}
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15 }}>
          Não viu seu destino favorito?
        </p>
        <motion.a
          href="https://wa.me/5521996832196"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--text-brand)',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
            borderBottom: '2px solid var(--p-champagne)',
            paddingBottom: 2,
          }}
          whileHover={{ gap: '14px' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Ver todos os destinos
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  )
}
