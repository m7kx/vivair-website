"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Navbar from "@/components/Navbar"
import AboutVivi from "@/components/AboutVivi"
import RotatingText from "@/components/RotatingText"
import WhatsAppButton from "@/components/WhatsAppButton"
import DestinationsSection from "@/components/DestinationsSection"
import MarqueeStrip from "@/components/MarqueeStrip"
import AnimatedText from "@/components/AnimatedText"
import NoiseBg from "@/components/NoiseBg"
import HeroBackground from "@/components/HeroBackground"

/* ── Step cards data ──────────────────────────────────────────────── */
const steps = [
  { num: "01", title: "Conta pra gente",  desc: "Seu destino dos sonhos, datas e quem vai junto" },
  { num: "02", title: "A gente desenha",  desc: "Roteiro personalizado com voos, hotel e experiências" },
  { num: "03", title: "Você aprova",       desc: "Revisa, ajusta e a gente cuida de toda a reserva" },
  { num: "04", title: "Só aproveitar",     desc: "Cada detalhe pensado para você" },
]

/* ── Stat item ────────────────────────────────────────────────────── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      style={{ textAlign: "center", padding: "8px 24px" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6, type: "spring", stiffness: 80 }}
    >
      <div style={{
        fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
        color: "var(--p-champagne)", letterSpacing: "-0.03em", lineHeight: 1,
        fontFamily: "var(--hero-font)",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(250,249,246,0.55)", marginTop: 5, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
        {label}
      </div>
    </motion.div>
  )
}

/* ── Glow orb (subtle, on top of image) ──────────────────────────── */
function GlowOrb({ top, left, size = 500, color = "rgba(196,163,90,0.06)", delay = 0 }: {
  top: string; left: string; size?: number; color?: string; delay?: number
}) {
  return (
    <motion.div
      style={{
        position: "absolute", top, left,
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
        pointerEvents: "none",
        translateX: "-50%", translateY: "-50%",
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

/* ── Main page ────────────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroBgY        = useTransform(heroScroll, [0, 1], ["0%",  "28%"])
  const heroContentY   = useTransform(heroScroll, [0, 1], ["0%",  "18%"])
  const heroOpacity    = useTransform(heroScroll, [0, 0.75], [1, 0])
  const heroBgScale    = useTransform(heroScroll, [0, 1], [1, 1.08])

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh", overflowX: "hidden", paddingTop: 0 }}>
      <Navbar />

      {/* ════ HERO ════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative", overflow: "hidden",
          minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* ── Cinematic image background (replaces gradient) ── */}
        <HeroBackground y={heroBgY} scale={heroBgScale} />

        {/* Subtle glow orbs — sit ON TOP of the image, z>0 */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", pointerEvents: "none" }}>
          <GlowOrb top="30%" left="22%" size={600} color="rgba(196,163,90,0.05)" delay={0} />
          <GlowOrb top="68%" left="76%" size={450} color="rgba(35,77,144,0.12)"  delay={3} />
        </div>

        {/* Grain texture */}
        <NoiseBg opacity={0.028} style={{ zIndex: 3 }} />

        {/* Grid overlay — very subtle, visible over image */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(250,249,246,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.018) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent)",
        }} />

        {/* Hero content */}
        <motion.div
          style={{
            position: "relative", zIndex: 5,
            maxWidth: 860, margin: "0 auto",
            padding: "140px 24px 120px",
            textAlign: "center",
            y: heroContentY,
            opacity: heroOpacity,
          }}
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 32 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 20px", borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--on-dark-accent)",
              border: "1px solid rgba(196,163,90,0.35)",
              background: "rgba(196,163,90,0.08)",
              backdropFilter: "blur(12px)",
            }}>
              <span style={{ fontSize: 16 }}>✦</span>
              Travel Design · Est. 2026
            </span>
          </motion.div>

          {/* Text scrim — subtle dark glow behind headline+subtitle for contrast */}
          <div style={{
            position: "relative",
          }}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-32px -60px",
                background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(5,16,40,0.52) 0%, transparent 72%)",
                borderRadius: 32,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

          {/* Main headline — word-by-word reveal */}
          <div style={{ marginBottom: 28, justifyContent: "center", position: "relative", zIndex: 1 }}>
            <AnimatedText
              text="Sua próxima viagem começa aqui"
              delay={0.3}
              stagger={0.065}
              style={{
                fontFamily: "var(--hero-font)",
                fontSize: "clamp(42px, 7.5vw, 76px)",
                fontWeight: 800,
                color: "var(--on-dark-1)",
                letterSpacing: "var(--hero-ls)",
                lineHeight: 1.1,
                justifyContent: "center",
                textShadow: [
                "0 2px 32px rgba(0,0,0,0.9)",
                "0 1px 8px rgba(0,0,0,0.95)",
                "0 0 60px rgba(10,31,68,0.6)",
              ].join(", "),
              }}
            />
          </div>

          {/* Rotating destination text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(18px, 2.2vw, 26px)",
              marginBottom: 48,
              position: "relative", zIndex: 1,
            }}
          >
            <RotatingText />
          </motion.div>
          </div>{/* /text-scrim wrapper */}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, type: "spring", stiffness: 80 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.a
              href="https://wa.me/5521996832196"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--grad-cta)", color: "white",
                padding: "18px 40px", borderRadius: "var(--btn-radius)",
                fontFamily: "var(--btn-font)", fontSize: 17,
                fontWeight: 600, textDecoration: "none",
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              Desenhe sua viagem
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
            <motion.a
              href="https://app.onertravel.com/vivairtraveldesign"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.10)", color: "var(--on-dark-1)",
                padding: "18px 40px", borderRadius: "var(--btn-radius)",
                fontFamily: "var(--btn-font)", fontSize: 17, fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.20)", textDecoration: "none",
                backdropFilter: "blur(12px)",
              }}
              whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.16)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              Reserve Online
            </motion.a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 1 }}
            style={{
              position: "absolute", bottom: 32, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}
          >
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(250,249,246,0.45)", textTransform: "uppercase" as const }}>
              Scroll
            </span>
            <motion.div
              style={{ width: 1.5, height: 44, background: "linear-gradient(to bottom, var(--p-champagne), transparent)" }}
              animate={{ scaleY: [0, 1, 0], originY: "top" }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
            />
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6,
            background: "rgba(10,31,68,0.70)",
            backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 40px",
          }}
        >
          <div style={{
            maxWidth: 860, margin: "0 auto",
            display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16,
          }}>
            <StatItem value="40+"  label="Destinos no mundo" />
            <StatItem value="100%" label="Roteiros personalizados" />
            <StatItem value="★"    label="Atendimento exclusivo" />
            <StatItem value="5★"   label="Experiência" />
          </div>
        </motion.div>
      </section>

      {/* ════ MARQUEE ═════════════════════════════════════════════════ */}
      <MarqueeStrip direction="left" speed={50} />


      {/* ════ DESTINATIONS ════════════════════════════════════════════ */}
      <DestinationsSection />

      {/* ════ SOBRE + VIVI ════════════════════════════════════════ */}
      <AboutVivi />

      {/* ════ COMO FUNCIONA ═══════════════════════════════════════════ */}
      <section style={{
        background: "var(--surface-page)", padding: "104px 24px 112px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: -120,
          width: 600, height: 600,
          background: "radial-gradient(ellipse at top right, rgba(196,163,90,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: -80,
          width: 500, height: 500,
          background: "radial-gradient(ellipse at bottom left, rgba(35,77,144,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-block",
                padding: "6px 20px", borderRadius: 100,
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase" as const,
                color: "var(--on-dark-accent)",
                background: "var(--surface-dark)",
                marginBottom: 24,
              }}
            >
              Processo
            </motion.span>
            <AnimatedText
              text="Como funciona"
              delay={0.1} stagger={0.08}
              style={{
                fontFamily: "var(--heading-font)",
                fontSize: "clamp(30px, 4.5vw, 48px)",
                fontWeight: 800, color: "var(--text-brand)",
                letterSpacing: "-0.03em",
                justifyContent: "center", lineHeight: 1.1,
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "40px 28px" }}>
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.12, type: "spring", stiffness: 90 }}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 320, damping: 22 } }}
                style={{
                  textAlign: "center", padding: "44px 28px 40px",
                  background: "var(--surface-card)",
                  borderRadius: "var(--card-radius)",
                  boxShadow: "var(--p-shadow-sm)",
                  border: "var(--border-light)",
                  cursor: "default", position: "relative", overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "var(--grad-cta)", scaleX: 0, originX: 0,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div style={{ fontSize: "var(--p-text-5xl)", fontWeight: 900, color: "var(--p-champagne)", marginBottom: 16, lineHeight: 1 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "var(--p-text-lg)", fontWeight: 700, marginBottom: 10, color: "var(--text-brand)" }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {s.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MARQUEE 2 (reverso) ═════════════════════════════════════ */}
      <MarqueeStrip direction="right" speed={60} bg="var(--surface-page)" color="var(--text-brand)" />

      {/* ════ CTA ═════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", padding: "104px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--grad-hero)", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--grad-glow)", zIndex: 0 }} />
        <NoiseBg opacity={0.025} />
        <motion.div
          style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(115deg, transparent 30%, rgba(196,163,90,0.05) 50%, transparent 70%)",
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--on-dark-accent)", marginBottom: 24 }}
          >
            Pronto pra próxima aventura?
          </motion.p>
          <AnimatedText
            text="Fale com a gente e desenhe sua viagem"
            delay={0.1} stagger={0.07}
            style={{
              fontFamily: "var(--hero-font)",
              fontSize: "clamp(30px, 4.5vw, 50px)",
              fontWeight: 800, color: "var(--on-dark-1)",
              letterSpacing: "-0.02em", lineHeight: 1.1,
              justifyContent: "center", marginBottom: 24,
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: 17, color: "var(--on-dark-2)", lineHeight: 1.6, marginBottom: 44 }}
          >
            Da primeira conversa até o check-in. Sem pegadinha, sem letra miúda.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--grad-cta)", color: "white", padding: "18px 40px", borderRadius: "var(--btn-radius)", fontFamily: "var(--btn-font)", fontSize: 17, fontWeight: 600, textDecoration: "none" }}
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}>
              Desenhe sua viagem
            </motion.a>
            <motion.a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "var(--on-dark-1)", padding: "18px 40px", borderRadius: "var(--btn-radius)", fontFamily: "var(--btn-font)", fontSize: 17, fontWeight: 500, border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none", backdropFilter: "blur(12px)" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}>
              WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ════ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{ position: "relative", overflow: "hidden", background: "var(--surface-dark)", padding: "60px 24px 40px", borderTop: "1px solid rgba(250,249,246,0.08)" }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--grad-hero)", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--grad-glow)", zIndex: 0 }} />
        <NoiseBg opacity={0.02} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px 40px", marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vivair-logo.svg" alt="VivAir Travel Design" style={{ height: 68, width: "auto" }} />
              </div>
              <p style={{ fontSize: 14, color: "var(--on-dark-2)", lineHeight: 1.65 }}>
                Travel Design — Desenhamos viagens com a sua cara.
              </p>
            </div>
            {([
              ["Navegação", ["Destinos", "Sobre", "Contato"]],
              ["Contato",   ["WhatsApp", "reservas@vivairtravel.com.br", "@vivair.travel"]],
              ["Legal",     ["Política de Privacidade", "Termos de Uso"]],
            ] as [string, string[]][]).map(([title, links]) => (
              <div key={title as string}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--on-dark-accent)", marginBottom: 16 }}>
                  {title}
                </p>
                {(links as string[]).map((l) => (
                  <p key={l} style={{ fontSize: 14, fontWeight: 500, color: "var(--on-dark-2)", lineHeight: 2.2 }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(250,249,246,0.08)", paddingTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--on-dark-3)" }}>
              VivAir Travel Design Ltda · CNPJ: 61.722.893/0001-73 · Empresa ativa no Cadastur
          </p>
          <p style={{ fontSize: 12, color: "rgba(250,249,246,0.3)", marginTop: 6 }}>
            Rio de Janeiro, RJ — Brasil
          </p>
          <p style={{ fontSize: 12, color: "rgba(250,249,246,0.3)", marginTop: 6 }}>
            © 2026 VivAir Travel Design. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  )
}
