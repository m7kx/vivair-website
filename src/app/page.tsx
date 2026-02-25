"use client"

import React, { useRef } from "react"
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
/* ── FooterLink ─────────────────────────────────────────────────────────── */
interface FooterLinkProps {
  href: string
  label: string
  icon?: React.ReactNode
  target?: string
}

function FooterLink({ href, label, icon, target = "_self" }: FooterLinkProps) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 2.2,
        color: hovered ? "rgba(250,249,246,0.95)" : "var(--on-dark-2)",
        transition: "color 0.2s ease",
      }}
    >
      {icon && (
        <span style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transform: hovered ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.2s ease",
          marginTop: 1,
        }}>
          {icon}
        </span>
      )}
      <span style={{
        position: "relative",
        paddingBottom: 1,
      }}>
        {label}
        <span style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1px",
          width: "100%",
          background: "rgba(200,169,110,0.6)",
          borderRadius: 1,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: hovered ? "left" : "right",
          transition: "transform 0.22s ease",
          display: "block",
        }}/>
      </span>
    </a>
  )
}

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
            padding: "clamp(80px,12vw,140px) 24px clamp(160px,20vw,200px)",
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
              border: "1px solid rgba(196,163,90,0.20)",
              background: "rgba(196,163,90,0.05)",
              backdropFilter: "blur(12px)",
            }}>
              <span style={{ fontSize: 16 }}>✦</span>
              Travel Design Experience
            </span>
          </motion.div>

          {/* Main headline — word-by-word reveal */}
          <div style={{ marginBottom: 28, justifyContent: "center" }}>
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
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(21px, 2.53vw, 30px)",
              marginBottom: 48,
              position: "relative", zIndex: 1,
            }}
          >
            <RotatingText />
          </motion.div>


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
                padding: "clamp(11px,2.5vw,18px) clamp(20px,5vw,40px)", borderRadius: "var(--btn-radius)",
                fontFamily: "var(--btn-font)", fontSize: "clamp(13px,3.5vw,17px)",
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
                padding: "clamp(11px,2.5vw,18px) clamp(20px,5vw,40px)", borderRadius: "var(--btn-radius)",
                fontFamily: "var(--btn-font)", fontSize: "clamp(13px,3.5vw,17px)", fontWeight: 500,
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

        {/* Stats bar — desktop only (absolute, sobrepõe hero) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
          className="stats-bar-desktop"
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

      {/* Stats bar — mobile only (fora da hero, aparece ao rolar) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{
          background: "rgba(10,31,68,0.95)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px",
          // Only visible on mobile
          display: "none",
        }}
        className="stats-bar-mobile"
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
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--grad-cta)", color: "white", padding: "clamp(11px,2.5vw,18px) clamp(20px,5vw,40px)", borderRadius: "var(--btn-radius)", fontFamily: "var(--btn-font)", fontSize: "clamp(13px,3.5vw,17px)", fontWeight: 600, textDecoration: "none" }}
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}>
              Desenhe sua viagem
            </motion.a>
            <motion.a href="https://wa.me/5521996832196" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "var(--on-dark-1)", padding: "clamp(11px,2.5vw,18px) clamp(20px,5vw,40px)", borderRadius: "var(--btn-radius)", fontFamily: "var(--btn-font)", fontSize: "clamp(13px,3.5vw,17px)", fontWeight: 500, border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none", backdropFilter: "blur(12px)" }}
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
            {/* Navegação */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--on-dark-accent)", marginBottom: 16 }}>
                Navegação
              </p>
              {[
                { label: "Destinos", href: "#destinos" },
                { label: "Sobre",    href: "#sobre"    },
                { label: "Contato",  href: "/contato"  },
              ].map(({ label, href }) => (
                <FooterLink key={label} href={href} label={label} />
              ))}
            </div>

            {/* Contato */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--on-dark-accent)", marginBottom: 16 }}>
                Contato
              </p>
              <FooterLink
                href="https://wa.me/5521996832196"
                label="+55 (21) 99683-2196"
                target="_blank"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.405A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z" fill="#25D366"/>
                    <path d="M8.5 8.5c.2-.45.55-.5.9-.5h.4c.3 0 .55.2.65.45l.75 1.8c.1.25.05.55-.1.75l-.5.55c-.05.1-.05.2 0 .3.35.65.82 1.22 1.4 1.7.15.13.3.1.42-.02l.5-.5c.2-.2.5-.25.75-.1l1.8.85c.25.12.4.38.38.65v.42c-.02.5-.25.9-.6 1.15-.5.33-1.15.45-1.8.3-1.5-.35-2.85-1.2-3.85-2.4-.85-1-1.35-2.2-1.4-3.4-.03-.6.12-1.2.45-1.6Z" fill="white"/>
                  </svg>
                }
              />
              <FooterLink
                href="mailto:reservas@vivairtravel.com.br"
                label="reservas@vivairtravel.com.br"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(200,169,110,0.85)" strokeWidth="1.6"/>
                    <path d="M2 7l9.293 6.293a1 1 0 0 0 1.414 0L22 7" stroke="rgba(200,169,110,0.85)" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                }
              />
              <FooterLink
                href="https://instagram.com/vivair.travel"
                label="@vivair.travel"
                target="_blank"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="ig2" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f09433"/>
                        <stop offset="50%" stopColor="#dc2743"/>
                        <stop offset="100%" stopColor="#bc1888"/>
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig2)" strokeWidth="1.6"/>
                    <circle cx="12" cy="12" r="4.5" stroke="url(#ig2)" strokeWidth="1.5"/>
                    <circle cx="17.5" cy="6.5" r="1.1" fill="url(#ig2)"/>
                  </svg>
                }
              />
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--on-dark-accent)", marginBottom: 16 }}>
                Legal
              </p>
              {[
                { label: "Política de Privacidade", href: "/privacidade" },
                { label: "Termos de Uso",           href: "/termos"     },
              ].map(({ label, href }) => (
                <FooterLink key={label} href={href} label={label} />
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(250,249,246,0.08)", paddingTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--on-dark-3)" }}>
              VivAir Travel Design Ltda · CNPJ: 61.722.893/0001-73 · Empresa ativa no Cadastur
            </p>
            {/* IATA credential badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, padding: "5px 14px", borderRadius: 100, border: "1px solid rgba(196,163,90,0.25)", background: "rgba(196,163,90,0.06)" }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(196,163,90,0.85)" }}>IATA</span>
              <span style={{ width: 1, height: 10, background: "rgba(196,163,90,0.2)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(250,249,246,0.55)", letterSpacing: "0.08em" }}>96219093</span>
              <span style={{ width: 1, height: 10, background: "rgba(196,163,90,0.2)" }} />
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(196,163,90,0.6)" }}>Agente Credenciado</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(250,249,246,0.3)", marginTop: 10 }}>
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
