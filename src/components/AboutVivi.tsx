"use client"

import { motion } from "framer-motion"

// ── About/Vivi Section ──────────────────────────────────────────────────────
// Posição no fluxo: entre DestinationsSection e Como Funciona
// Layout: 2 colunas desktop / imagem + texto mobile
// Avatar: Vivi — Travel Designer (blazer azul)
// TODO: substituir /vivi-placeholder.jpg pela foto real da Vivi
export default function AboutVivi() {
  return (
    <section
      id="sobre"
      style={{
        position: "relative",
        background: "var(--surface-dark)",
        padding: "120px 24px",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient bg */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(10,31,68,0.6) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "relative", zIndex: 1,
          maxWidth: 1100, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
        className="about-grid"
      >
        {/* ── Text column ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p style={{
            fontSize: 11, fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.18em",
            color: "var(--on-dark-accent)",
            marginBottom: 20,
            fontFamily: "var(--p-font-primary)",
          }}>
            ✦ Sobre a VivAir
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "var(--heading-font)",
            fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 52px)",
            lineHeight: 1.1,
            color: "var(--on-dark-1)",
            marginBottom: 28,
            letterSpacing: "-0.01em",
          }}>
            Viagens desenhadas<br />
            <em>por quem entende de você</em>
          </h2>

          {/* Body */}
          <p style={{
            fontFamily: "var(--p-font-primary)",
            fontSize: "clamp(16px, 1.8vw, 18px)",
            lineHeight: 1.7,
            color: "var(--on-dark-2)",
            marginBottom: 24,
            maxWidth: 480,
          }}>
            A VivAir nasceu de uma certeza simples: as melhores viagens
            não saem de catálogos — saem de conversas. Somos uma
            agência de Travel Design que desenha roteiros sob medida,
            do voo ao restaurante que ninguém encontra no Google.
          </p>

          {/* Quote block */}
          <blockquote style={{
            borderLeft: "2px solid var(--p-champagne)",
            paddingLeft: 20,
            margin: "32px 0 0",
          }}>
            <p style={{
              fontFamily: "var(--heading-font)",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2vw, 22px)",
              lineHeight: 1.5,
              color: "var(--on-dark-1)",
              marginBottom: 12,
            }}>
              &ldquo;Cada viagem é um projeto único.
              A gente cuida de tudo para você
              só se preocupar em aproveitar.&rdquo;
            </p>
            <cite style={{
              fontFamily: "var(--p-font-primary)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--on-dark-accent)",
              fontStyle: "normal",
            }}>
              — Vivi, Travel Designer
            </cite>
          </blockquote>
        </motion.div>

        {/* ── Vivi photo column ── */}
        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              aspectRatio: "3/4",
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(10,31,68,0.4)",
              border: "1px solid rgba(196,163,90,0.15)",
            }}
          >
            {/* TODO: Substituir por foto real da Vivi (blazer azul) */}
            {/* <Image src="/vivi-blazer-azul.jpg" alt="Vivi — Travel Designer VivAir" fill style={{ objectFit: "cover" }} /> */}

            {/* Placeholder visual until photo is provided */}
            <div
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(10,31,68,0.8) 0%, rgba(196,163,90,0.15) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(196,163,90,0.2)",
                border: "1px solid rgba(196,163,90,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 32 }}>✦</span>
              </div>
              <p style={{
                fontSize: 13, color: "rgba(250,249,246,0.4)",
                fontFamily: "var(--p-font-primary)",
                textAlign: "center",
                padding: "0 24px",
              }}>
                Foto da Vivi<br />em breve
              </p>
            </div>

            {/* Name badge */}
            <div style={{
              position: "absolute", bottom: 24, left: 24, right: 24,
              background: "rgba(8,24,55,0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: 10,
              padding: "12px 16px",
              border: "1px solid rgba(196,163,90,0.2)",
            }}>
              <p style={{
                fontSize: 15, fontWeight: 600,
                color: "rgba(250,249,246,0.95)",
                fontFamily: "var(--p-font-primary)",
                marginBottom: 2,
              }}>Vivi</p>
              <p style={{
                fontSize: 11, fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--on-dark-accent)",
                fontFamily: "var(--p-font-primary)",
              }}>Travel Designer · VivAir</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .about-grid > div:first-child {
            order: 2;
          }
          .about-grid > div:last-child {
            order: 1;
          }
        }
      `}</style>
    </section>
  )
}
