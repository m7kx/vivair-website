"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

export default function ContactHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -80])

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Parallax image ── */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-10% 0",
          y: heroY,
        }}
      >
        {/* Ken Burns subtle zoom */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            src="/contato-hero.jpg"
            alt="Travel map with passports and destinations"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center bottom" }}
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      {/* ── Cinematic overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(155deg, rgba(10,31,68,0.82) 0%, rgba(10,31,68,0.45) 60%, rgba(10,31,68,0.25) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom vignette to blend into form section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "28%",
          background: "linear-gradient(to bottom, transparent, rgba(10,31,68,0.95))",
          pointerEvents: "none",
        }}
      />

      {/* ── Hero text ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 720,
        }}
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "var(--btn-font, 'DM Sans', sans-serif)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.9)",
            marginBottom: 16,
          }}
        >
          Whycation · Experiências Sob Medida
        </motion.p>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 20,
            textShadow: "0 2px 24px rgba(10,31,68,0.6), 0 1px 4px rgba(10,31,68,0.4)",
          }}
        >
          Conte-nos Seu Porquê
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: "'Outfit', 'DM Sans', sans-serif",
            fontSize: "clamp(1rem, 2.2vw, 1.18rem)",
            fontWeight: 400,
            color: "rgba(245,240,232,0.82)",
            lineHeight: 1.65,
            maxWidth: 580,
            margin: "0 auto",
          }}
        >
          Cada grande viagem nasce de uma razão que só você conhece.
          Compartilhe a sua — e nós traçamos rotas que transformam esse
          porquê em memórias que duram a vida toda.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          variants={fadeUp}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginTop: 40 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block", opacity: 0.5 }}>
            <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(245,240,232,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
