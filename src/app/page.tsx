"use client"

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PartnersCarousel from '@/components/PartnersCarousel'
import WhatsAppButton from '@/components/WhatsAppButton'

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const steps = [
  { num: '01', title: 'Conta pra gente',  desc: 'Seu destino dos sonhos, datas e quem vai junto' },
  { num: '02', title: 'A gente desenha',  desc: 'Roteiro personalizado com voos, hotel e experiências' },
  { num: '03', title: 'Você aprova',      desc: 'Revisa, ajusta e a gente cuida de toda a reserva' },
  { num: '04', title: 'Só aproveitar',    desc: 'E postar nos Stories 😉' },
]

export default function Home() {
  return (
    <main style={{ background: 'var(--surface-page)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ fontSize: 'var(--p-text-sm)', fontWeight: 'var(--overline-weight)', textTransform: 'uppercase', letterSpacing: 'var(--overline-ls)', color: 'var(--on-dark-accent)', marginBottom: 20 }}>
            Travel Design
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ fontFamily: 'var(--hero-font)', fontSize: 'var(--hero-size)', fontWeight: 'var(--hero-weight)', color: 'var(--on-dark-1)', letterSpacing: 'var(--hero-ls)', lineHeight: 'var(--hero-lh)', marginBottom: 20 }}>
            Sua próxima viagem começa com uma conversa
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontFamily: 'var(--body-font)', fontSize: 'var(--p-text-lg)', fontWeight: 400, color: 'var(--on-dark-2)', lineHeight: 1.6, marginBottom: 36, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Desenhamos experiências de viagem com a sua cara. Da inspiração ao embarque, a gente cuida de tudo.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--grad-cta)', color: 'white', padding: '16px 36px', borderRadius: 'var(--btn-radius)', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 'var(--btn-weight)', textDecoration: 'none' }}>
              Desenhe sua viagem
            </a>
            <a href="https://app.onertravel.com/vivairtraveldesign/home" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--on-dark-1)', padding: '16px 36px', borderRadius: 'var(--btn-radius)', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 500, border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none' }}>
              Reserve Online
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Partners Carousel (modular — remover: <PartnersCarousel hidden />) ── */}
      <PartnersCarousel />

      {/* ── Como funciona ── */}
      <section style={{ background: 'var(--surface-page)', padding: '88px 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--heading-font)', fontSize: 'var(--p-text-4xl)', fontWeight: 'var(--heading-weight)', textAlign: 'center', color: 'var(--text-brand)', letterSpacing: '-0.03em', marginBottom: 64 }}>
            Como funciona
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 32px' }}>
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--surface-card)', borderRadius: 'var(--card-radius)', boxShadow: 'var(--p-shadow-sm)', border: 'var(--border-light)' }}>
                {/* Número em navy para contraste máximo no fundo claro */}
                <div style={{ fontSize: 'var(--p-text-5xl)', fontWeight: 'var(--step-num-weight)', color: 'var(--p-champagne)', marginBottom: 12, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 'var(--p-text-lg)', fontWeight: 'var(--step-title-w)', marginBottom: 8, color: 'var(--text-brand)' }}>{s.title}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 'var(--overline-weight)', textTransform: 'uppercase', letterSpacing: 'var(--overline-ls)', color: 'var(--on-dark-accent)', marginBottom: 20 }}>
            Pronto pra próxima aventura?
          </p>
          <h2 style={{ fontFamily: 'var(--hero-font)', fontSize: 'var(--p-text-5xl)', fontWeight: 'var(--hero-weight)', color: 'var(--on-dark-1)', letterSpacing: 'var(--hero-ls)', lineHeight: 'var(--hero-lh)', marginBottom: 20 }}>
            Fale com a gente e desenhe sua viagem
          </h2>
          <p style={{ fontSize: 'var(--p-text-lg)', fontWeight: 400, color: 'var(--on-dark-2)', lineHeight: 1.6, marginBottom: 36 }}>
            Da primeira conversa até o check-in. Sem pegadinha, sem letra miúda.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--grad-cta)', color: 'white', padding: '16px 36px', borderRadius: 'var(--btn-radius)', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 'var(--btn-weight)', textDecoration: 'none' }}>
              Desenhe sua viagem
            </a>
            <a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--on-dark-1)', padding: '16px 36px', borderRadius: 'var(--btn-radius)', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 500, border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none' }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '56px 24px 40px', borderTop: '1px solid rgba(250,249,246,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px 40px', marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 14 }}>
                <img src="/vivair-logo.svg" alt="VivAir Travel Design" style={{ height: 52, width: 'auto' }} />
              </div>
              <p style={{ fontSize: 14, color: 'var(--on-dark-2)', lineHeight: 1.65 }}>Travel Design — Desenhamos viagens com a sua cara.</p>
            </div>
            {([
              ['Navegação', ['Início', 'Experiências', 'Sobre', 'Contato']],
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

      {/* ── WhatsApp Floating Button (modular — remover: <WhatsAppButton hidden />) ── */}
      <WhatsAppButton />

    </main>
  )
}
