"use client"

import { useRef, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

/* ── FloatingLogo ──────────────────────────────────────────────────────────────
   - Fixed position, top-left
   - Magnetic: cursor proximity < 160px → logo is attracted toward cursor
   - Float: gentle sine-wave y oscillation when idle
   - Entrance: blur+scale reveal matching the hero cinematic entrance
   - Hover: ring expands, scale pulse, champagne shimmer
   - Touch devices: magnetic off (preserves perf), float stays
   - Portal: rendered directly in document.body → escapes any transformed
     ancestor (parallax, Framer Motion wrappers) that would break position:fixed
───────────────────────────────────────────────────────────────────────────────── */

const LOGO_SIZE       = 153   // diameter (px) – 15% smaller than 180px [v5]
const INNER_LOGO_SIZE =  95   // inner logo: ~15% smaller than previous 112px
const MAGNETIC_RADIUS = 160   // px – distance at which logo starts being pulled
const MAGNETIC_STRENGTH = 0.38

export default function FloatingLogo() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isTouch,  setIsTouch]  = useState(false)

  // Spring-smoothed magnetic offset
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springCfg = { stiffness: 140, damping: 18, mass: 0.8 }
  const magX = useSpring(rawX, springCfg)
  const magY = useSpring(rawY, springCfg)

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  // Magnetic mouse tracking
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
        const t = 1 - dist / MAGNETIC_RADIUS   // 0 at edge, 1 at center
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

  // Portal only runs on client (SSR-safe: returns null until mounted)
  if (!mounted) return null

  return createPortal(
    <motion.div
      ref={wrapRef}
      style={{
        position: "fixed",
        top: 20,
        left: 36,
        zIndex: 1100,          // above Navbar (z:1000)
        x: magX,
        y: magY,
        pointerEvents: "auto",
      }}
    >
      {/* ── Float (breathing oscillation) ── */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        style={{ position: "relative" }}
      >
        {/* ── Entrance animation ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ position: "relative" }}
        >
          {/* ── Pulse ring (always animating, behind everything) ── */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale:   [1, 1.55, 2.1],
              opacity: [0.45, 0.18, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 1.4,
            }}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: LOGO_SIZE, height: LOGO_SIZE,
              borderRadius: "50%",
              border: `1.5px solid rgba(196,163,90,0.55)`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Second pulse ring (offset timing) ── */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale:   [1, 1.4, 1.85],
              opacity: [0.3, 0.1, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 1.4,
              delay: 1.2,
            }}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: LOGO_SIZE, height: LOGO_SIZE,
              borderRadius: "50%",
              border: `1px solid rgba(196,163,90,0.35)`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />

          {/* ── The circular medallion ── */}
          <motion.a
            href="/"
            aria-label="VivAir – Home"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              textDecoration: "none",
              cursor: "pointer",
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
            {/* Logo image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vivair-logo.svg"
              alt="VivAir"
              style={{
                height: INNER_LOGO_SIZE,
                width: "auto",
                display: "block",
                position: "relative",
                zIndex: 2,
                filter: "drop-shadow(0 2px 8px rgba(10,31,68,0.7))",
              }}
            />

            {/* Hover shimmer overlay */}
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
                    position: "absolute",
                    top: 0, left: 0,
                    width: "60%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(196,163,90,0.25), transparent)",
                    borderRadius: "50%",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Inner glow on hover */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: hovered ? 1 : 0,
                background: hovered
                  ? "radial-gradient(circle at 50% 50%, rgba(196,163,90,0.18) 0%, transparent 70%)"
                  : "radial-gradient(circle at 50% 50%, rgba(196,163,90,0.0) 0%, transparent 70%)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
