"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

/* ── FloatingLogo ───────────────────────────────────────────────────
   - position: fixed → renderizado diretamente em body via layout.tsx
     (fora de qualquer SmoothScrollProvider / stacking context do Framer Motion)
   - Magnetic: cursor proximity < 160px → atraído para o cursor
   - Float: oscilação suave tipo onda seno
   - Entrance: blur+scale reveal
   - Hover: shimmer champanhã, pulse ring, inner glow
   - Touch: magnetic desligado (preserva perf), float mantido
   - Diâmetro: 153px (180px −15%) [v5]
─────────────────────────────────────────────────────────────── */

const LOGO_SIZE       = 153
const INNER_LOGO_SIZE =  95
const MAGNETIC_RADIUS = 160
const MAGNETIC_STRENGTH = 0.38

export default function FloatingLogo() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isTouch,  setIsTouch]  = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springCfg = { stiffness: 140, damping: 18, mass: 0.8 }
  const magX = useSpring(rawX, springCfg)
  const magY = useSpring(rawY, springCfg)

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MAGNETIC_RADIUS) {
        const t = 1 - dist / MAGNETIC_RADIUS
        rawX.set(dx * t * MAGNETIC_STRENGTH)
        rawY.set(dy * t * MAGNETIC_STRENGTH)
      } else {
        rawX.set(0)
        rawY.set(0)
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [isTouch, rawX, rawY])

  if (!mounted) return null

  return (
    <motion.div
      ref={wrapRef}
      style={{
        position: "fixed",
        top: 20,
        left: 36,
        zIndex: 1100,
        x: magX,
        y: magY,
        pointerEvents: "auto",
      }}
    >
      {/* Float */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
        style={{ position: "relative" }}
      >
        {/* Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative" }}
        >
          {/* Pulse ring 1 */}
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.55, 2.1], opacity: [0.45, 0.18, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", repeatDelay: 1.4 }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: "50%",
              border: "1.5px solid rgba(196,163,90,0.55)",
              transform: "translate(-50%, -50%)", pointerEvents: "none",
            }}
          />
          {/* Pulse ring 2 */}
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.4, 1.85], opacity: [0.3, 0.1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", repeatDelay: 1.4, delay: 1.2 }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: "50%",
              border: "1px solid rgba(196,163,90,0.35)",
              transform: "translate(-50%, -50%)", pointerEvents: "none",
            }}
          />
          {/* Medallion */}
          <motion.a
            href="/"
            aria-label="VivAir – Home"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: "50%",
              overflow: "hidden", position: "relative",
              textDecoration: "none", cursor: "pointer",
              background: "radial-gradient(circle at 38% 35%, rgba(196,163,90,0.28) 0%, rgba(10,31,68,0.96) 65%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(196,163,90,0.70)",
              boxShadow: [
                "0 8px 32px rgba(10,31,68,0.65)",
                "0 2px 8px rgba(10,31,68,0.55)",
                "inset 0 1px 0 rgba(196,163,90,0.28)",
                "0 0 0 1px rgba(196,163,90,0.18)",
              ].join(", "),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vivair-logo.svg"
              alt="VivAir"
              style={{
                height: INNER_LOGO_SIZE, width: "auto",
                display: "block", position: "relative", zIndex: 2,
                filter: "drop-shadow(0 2px 8px rgba(10,31,68,0.7))",
              }}
            />
            {/* Shimmer */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key="shimmer"
                  initial={{ opacity: 0, x: "-120%" }}
                  animate={{ opacity: 1, x: "120%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  aria-hidden="true"
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "60%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(196,163,90,0.25), transparent)",
                    borderRadius: "50%", zIndex: 3, pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>
            {/* Inner glow */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: hovered ? 1 : 0,
                background: hovered
                  ? "radial-gradient(circle at 50% 50%, rgba(196,163,90,0.18) 0%, transparent 70%)"
                  : "radial-gradient(circle at 50% 50%, rgba(196,163,90,0.0) 0%, transparent 70%)",
              }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", zIndex: 1, pointerEvents: "none" }}
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
