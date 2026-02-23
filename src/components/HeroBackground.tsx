"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionValue } from "framer-motion"

interface Slide {
  url: string
  dx: number   // Ken Burns horizontal drift (px, from center)
  dy: number   // Ken Burns vertical drift (px, from center)
}

// 4 destinos paradisíacos — Unsplash CDN, 1920w, q=85
const SLIDES: Slide[] = [
  {
    // Maldivas — overwater bungalows, turquoise water
    url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=85&auto=format&fit=crop",
    dx: 18, dy: -12,
  },
  {
    // Santorini — caldera, blue domes at sunset
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85&auto=format&fit=crop",
    dx: -16, dy: -8,
  },
  {
    // Bali — tropical rice terraces
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85&auto=format&fit=crop",
    dx: 14, dy: -10,
  },
  {
    // Dubai — skyline + desert at golden hour
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=85&auto=format&fit=crop",
    dx: -20, dy: 8,
  },
]

const SLIDE_DURATION = 7000  // ms each slide stays
const CROSSFADE_S   = 1.6   // crossfade between slides (seconds)
const ENTRANCE_S    = 2.0   // cinematic entrance duration (seconds)
const KEN_DURATION  = SLIDE_DURATION / 1000 // Ken Burns duration matches slide

// ── Single slide item (isolated closure — prevents stale backgroundImage) ──
function SlideItem({
  slide,
  isCinematic,
}: {
  slide: Slide
  isCinematic: boolean
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        ...(isCinematic && { scale: 1.14, filter: "blur(18px)" }),
      }}
      animate={{ opacity: 1, scale: 1.0, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: {
          duration: isCinematic ? ENTRANCE_S : CROSSFADE_S,
          ease: "easeOut",
        },
        scale:  { duration: isCinematic ? ENTRANCE_S : 0, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: isCinematic ? ENTRANCE_S * 0.75 : 0, ease: "easeOut" },
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Inner wrapper — Ken Burns (scale + drift) independent of fade */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-6%",   // oversized: room to pan without clipping
          backgroundImage: `url(${slide.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          willChange: "transform",
        }}
        initial={{ x: 0, y: 0, scale: 1.0 }}
        animate={{
          x: slide.dx,
          y: slide.dy,
          scale: 1.08,
        }}
        transition={{
          duration: KEN_DURATION,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}

// ── Main HeroBackground ───────────────────────────────────────────────────────
export default function HeroBackground({
  y,
  scale: scrollScale,
}: {
  y?: MotionValue<string>
  scale?: MotionValue<number>
}) {
  const [index,    setIndex]    = useState(0)
  const [isMounted, setMounted] = useState(false)
  const firstDoneRef = useRef(false)

  // Preload all images immediately on mount
  useEffect(() => {
    setMounted(true)
    SLIDES.forEach((s) => {
      const img = new window.Image()
      img.src = s.url
    })
  }, [])

  // Cycle slides
  useEffect(() => {
    if (!isMounted) return
    const entranceTimer = setTimeout(() => { firstDoneRef.current = true }, ENTRANCE_S * 1000 + 500)
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => { clearInterval(interval); clearTimeout(entranceTimer) }
  }, [isMounted])

  // Determine if this render is the cinematic first entrance
  const isCinematic = index === 0 && !firstDoneRef.current

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: "-20%",
        y,
        scale: scrollScale,
        zIndex: 0,
        willChange: "transform",
        overflow: "hidden",
      }}
    >
      {/* ── Slideshow ── */}
      <AnimatePresence>
        <SlideItem
          key={index}
          slide={SLIDES[index]}
          isCinematic={isCinematic}
        />
      </AnimatePresence>

      {/* ── Gradient overlay: readability + brand color retention ── */}
      {/* Top/bottom dark for navbar + stats bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
          background: [
            "linear-gradient(to bottom,",
            "  rgba(10,31,68,0.78) 0%,",     // navbar area
            "  rgba(10,31,68,0.28) 38%,",    // image shines through (center)
            "  rgba(10,31,68,0.20) 55%,",    // image shines through
            "  rgba(10,31,68,0.65) 100%",    // stats bar / bottom
            ")",
          ].join(""),
        }}
      />

      {/* Vignette corners */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none",
          background: "radial-gradient(ellipse 130% 90% at 50% 45%, transparent 40%, rgba(10,31,68,0.50) 100%)",
        }}
      />

      {/* Champagne glow (top-center) — brand tint on image */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 45% at 50% 22%, rgba(196,163,90,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Slide progress pills (right edge) ── */}
      <div
        style={{
          position: "absolute",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          pointerEvents: "none",
        }}
      >
        {SLIDES.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height:          i === index ? 28 : 8,
              opacity:         i === index ? 1  : 0.3,
              backgroundColor: i === index ? "rgba(196,163,90,0.95)" : "rgba(250,249,246,0.4)",
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 2, borderRadius: 1 }}
          />
        ))}
      </div>

      {/* ── Destination label (bottom-left) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${index}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: 100,      // above stats bar
            left: 36,
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Champagne dot */}
          <div style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "rgba(196,163,90,0.9)",
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "rgba(250,249,246,0.65)",
            fontFamily: "var(--heading-font)",
          }}>
            {["Maldivas", "Santorini", "Bali", "Dubai"][index]}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
