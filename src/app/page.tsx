"use client"

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PartnersCarousel from '@/components/PartnersCarousel'
import WhatsAppButton from '@/components/WhatsAppButton'
import DestinationsSection from '@/components/DestinationsSection'

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const steps = [
  { num: '01', title: 'Conta pra gente',  desc: 'Seu destino dos sonhos, datas e quem vai junto' },
  { num: '02', title: 'A gente desenha',  desc: 'Roteiro personalizado com voos, hotel e experiências' },
  { num: '03', title: 'Você aprova',      desc: 'Revisa, ajusta e a gente cuida de toda a reserva' },
  { num: '04', title: 'Só aproveitar',    desc: 'E postar nos Stories 😉' },
]

/* ── Animated counter ───────────────────────────────────────────── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      style={{ textAlign: 'center' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
    >
      <div style={{
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 800,
        color: 'var(--p-champagne)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        fontFamily: 'var(--hero-font)',
      }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--on-dark-3)', marginTop: 6, letterSpacing: '0.05em' }}>{label}</div>
    </motion.div>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)

  /* Parallax: hero background moves slower than scroll */
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroBgY = useTransform(heroScrollY, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0])
  const heroScale = useTransform(heroScrollY, [0, 1], [1, 1.08])

  return (
    <main style={{ background: 'var(--surface-page)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Parallax background layers */}
        <motion.div
          style={{
            position: 'absolute', inset: '-20%',
            background: 'var(--grad-hero)',
            y: heroBgY, scale: heroScale,
            zIndex: 0, willChange: 'transform',
          }}
        />
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'var(--grad-glow)',
            zIndex: 1, willChange: 'opacity',
          }}
        />
        {/* Animated grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(250,249,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }} />

        {/* Hero content */}
        <motion.div
          style={{
            position: 'relative', zIndex: 2,
            maxWidth: 820, margin: '0 auto',
            padding: '120px 24px 80px',
            textAlign: 'center',
            opacity: heroOpacity,
          }}
        >
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 28,
            }}
          >
            <span style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: 100,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--on-dark-accent)',
              border: '1px solid rgba(196,163,90,0.4)',
              background: 'rgba(196,163,90,0.08)',
            }}>
              ✦ Travel Design
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              fontFamily: 'var(--hero-font)',
              fontSize: 'clamp(40px, 8vw, 80px)',
              fontWeight: 800, color: 'var(--on-dark-1)',
              letterSpacing: 'var(--hero-ls)', lineHeight: 'var(--hero-lh)',
              marginBottom: 24,
            }}
          >
            Sua próxima viagem<br />
            <span style={{ color: 'var(--p-champagne)' }}>começa com</span> uma conversa
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{
              fontFamily: 'var(--body-font)', fontSize: 'var(--p-text-lg)',
              fontWeight: 400, color: 'var(--on-dark-2)',
              lineHeight: 1.65, marginBottom: 48,
              maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            Desenhamos experiências de viagem com a sua cara.
            Da inspiração ao embarque, a gente cuida de tudo.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="https://wa.me/5521996832196"
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--grad-cta)', color: 'white',
                padding: '18px 40px', borderRadius: 'var(--btn-radius)',
                fontFamily: 'var(--btn-font)', fontSize: 17,
                fontWeight: 'var(--btn-weight)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Desenhe sua viagem
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
            <motion.a
              href="https://app.onertravel.com/vivairtraveldesign/home"
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.10)',
                color: 'var(--on-dark-1)',
                padding: '18px 40px', borderRadius: 'var(--btn-radius)',
                fontFamily: 'var(--btn-font)', fontSize: 17,
                fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Reserve Online
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            style={{
              position: 'absolute', bottom: -48, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--on-dark-3)', textTransform: 'uppercase' }}>
              Scroll
            </span>
            <motion.div
              style={{
                width: 1, height: 40,
                background: 'linear-gradient(to bottom, var(--p-champagne), transparent)',
              }}
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Stats strip at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 3,
            background: 'rgba(10,31,68,0.6)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '24px 40px',
          }}
        >
          <div style={{
            maxWidth: 900, margin: '0 auto',
            display: 'flex', justifyContent: 'space-around',
            flexWrap: 'wrap', gap: 24,
          }}>
            <StatItem value="40+" label="Parceiros globais" />
            <StatItem value="500+" label="Roteiros criados" />
            <StatItem value="100%" label="Personalizado" />
            <StatItem value="5★" label="Experiência" />
          </div>
        </motion.div>
      </section>

      {/* ── PARTNERS ── */}
      <PartnersCarousel />

      {/* ── DESTINATIONS ── */}
      <DestinationsSection />

      {/* ── COMO FUNCIONA ── */}
      <section style={{ background: 'var(--surface-page)', padding: '96px 24px 104px', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 480, height: 480,
          background: 'radial-gradient(ellipse at top right, rgba(196,163,90,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '6px 20px', borderRadius: 100,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase' as const,
              color: 'var(--on-dark-accent)',
              background: 'var(--surface-dark)',
              marginBottom: 20,
            }}>
              Processo
            </span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 80 }}
              style={{
                fontFamily: 'var(--heading-font)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 'var(--heading-weight)',
                textAlign: 'center', color: 'var(--text-brand)',
                letterSpacing: '-0.03em',
              }}
            >
              Como funciona
            </motion.p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px 32px' }}>
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                style={{
                  textAlign: 'center', padding: '40px 24px 36px',
                  background: 'var(--surface-card)',
                  borderRadius: 'var(--card-radius)',
                  boxShadow: 'var(--p-shadow-sm)',
                  border: 'var(--border-light)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle gradient top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'var(--grad-cta)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s ease',
                }} className={`step-bar-${i}`} />

                <div style={{
                  fontSize: 'var(--p-text-5xl)', fontWeight: 'var(--step-num-weight)',
                  color: 'var(--p-champagne)', marginBottom: 12, lineHeight: 1,
                }}>
                  {s.num}
                </div>
                <div style={{
                  fontSize: 'var(--p-text-lg)', fontWeight: 'var(--step-title-w)',
                  marginBottom: 8, color: 'var(--text-brand)',
                }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', zIndex: 0 }} />
        {/* Animated shimmer */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(135deg, transparent 40%, rgba(196,163,90,0.04) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 620, margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 12, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              color: 'var(--on-dark-accent)', marginBottom: 20,
            }}
          >
            Pronto pra próxima aventura?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, type: 'spring', stiffness: 80 }}
            style={{
              fontFamily: 'var(--hero-font)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800, color: 'var(--on-dark-1)',
              letterSpacing: 'var(--hero-ls)', lineHeight: 'var(--hero-lh)',
              marginBottom: 20,
            }}
          >
            Fale com a gente e desenhe sua viagem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontSize: 'var(--p-text-lg)', fontWeight: 400,
              color: 'var(--on-dark-2)', lineHeight: 1.6, marginBottom: 40,
            }}
          >
            Da primeira conversa até o check-in. Sem pegadinha, sem letra miúda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="https://wa.me/5521996832196"
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--grad-cta)', color: 'white',
                padding: '18px 40px', borderRadius: 'var(--btn-radius)',
                fontFamily: 'var(--btn-font)', fontSize: 17,
                fontWeight: 'var(--btn-weight)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Desenhe sua viagem
            </motion.a>
            <motion.a
              href="https://wa.me/5521996832196"
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.10)',
                color: 'var(--on-dark-1)',
                padding: '18px 40px', borderRadius: 'var(--btn-radius)',
                fontFamily: 'var(--btn-font)', fontSize: 17,
                fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '56px 24px 40px', borderTop: '1px solid rgba(250,249,246,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px 40px', marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vivair-logo.svg" alt="VivAir Travel Design" style={{ height: 68, width: 'auto' }} />
              </div>
              <p style={{ fontSize: 14, color: 'var(--on-dark-2)', lineHeight: 1.65 }}>Travel Design — Desenhamos viagens com a sua cara.</p>
            </div>
            {([
              ['Navegação', ['Início', 'Destinos', 'Experiências', 'Sobre', 'Contato']],
              ['Contato',   ['WhatsApp', 'reservas@vivairtravel.com.br', '@vivair.travel']],
              ['Legal',     ['Política de Privacidade', 'Termos de Uso']],
            ] as [string, string[]][]).map(([title, links]) => (
              <div key={title as string}>
                <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--on-dark-accent)', marginBottom: 14 }}>{title}</p>
                {(links as string[]).map((l) => (
                  <p key={l} style={{ fontSize: 14, fontWeight: 500, color: 'var(--on-dark-2)', lineHeight: 2.1 }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(250,249,246,0.10)', paddingTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--on-dark-3)' }}>© 2026 VivAir Travel Design. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  )
}
