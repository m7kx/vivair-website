"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionValue } from "framer-motion"

interface Slide {
  url: string
  dx: number            // Ken Burns horizontal drift (px)
  dy: number            // Ken Burns vertical drift (px)
  desktopPos: string    // backgroundPosition on desktop/tablet (≥768px)
  mobilePos: string     // backgroundPosition on mobile (<768px)
}

// 6 destinos VivAir — fotos editoriais geradas via Gemini Imagen 3 (2K, 16:9)
// mobilePos: ajustado para portrait — foca no assunto principal, evita céu vazio
const SLIDES: Slide[] = [
  {
    url: "/hero/hero-rio.jpg",       // Botafogo golden hour
    dx: 18, dy: -12,
    desktopPos: "center center",
    mobilePos: "center 70%",         // puxa para baixo — mar + montanhas
  },
  {
    url: "/hero/hero-maldivas.jpg",  // overwater bungalows sunset
    dx: -16, dy: -8,
    desktopPos: "center center",
    mobilePos: "center 75%",         // bungalôs ficam visíveis, menos céu
  },
  {
    url: "/hero/hero-santorini.jpg", // blue domes blue hour
    dx: 14, dy: -10,
    desktopPos: "center center",
    mobilePos: "center 50%",         // cúpulas já estão no centro
  },
  {
    url: "/hero/hero-tokyo.jpg",     // cherry blossom at dusk
    dx: -18, dy: 10,
    desktopPos: "center center",
    mobilePos: "center 35%",         // galhos da cerejeira no topo
  },
  {
    url: "/hero/hero-paris.jpg",     // Eiffel Tower golden hour
    dx: 20, dy: -8,
    desktopPos: "center center",
    mobilePos: "center 45%",         // torre no centro vertical
  },
  {
    url: "/hero/hero-patagonia.jpg", // Torres del Paine sunrise
    dx: -14, dy: -12,
    desktopPos: "center center",
    mobilePos: "center 65%",         // picos + base do glaciar visíveis
  },
]

const SLIDE_DURATION = 7000
const CROSSFADE_S    = 2.5
const ENTRANCE_S     = 2.0
const KEN_DURATION   = SLIDE_DURATION / 1000

// ── Single slide item ─────────────────────────────────────────────────────────
function SlideItem({
  slide,
  isCinematic,
  isMobile,
}: {
  slide: Slide
  isCinematic: boolean
  isMobile: boolean
}) {
  const bgPos = isMobile ? slide.mobilePos : slide.desktopPos

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: isCinematic ? 1.14 : 0.97,
        filter: isCinematic ? "blur(18px)" : "blur(10px)",
      }}
      animate={{ opacity: 1, scale: 1.0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
      transition={{
        opacity:  { duration: isCinematic ? ENTRANCE_S : CROSSFADE_S,       ease: [0.25, 0.46, 0.45, 0.94] },
        scale:    { duration: isCinematic ? ENTRANCE_S : CROSSFADE_S * 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
        filter:   { duration: isCinematic ? ENTRANCE_S * 0.75 : CROSSFADE_S * 0.7, ease: "easeOut" },
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Inner wrapper — Ken Burns (scale + drift) independent of fade */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-6%",
          backgroundImage: `url(${slide.url})`,
          backgroundSize: "cover",
          backgroundPosition: bgPos,
          backgroundRepeat: "no-repeat",
          willChange: "transform",
        }}
        initial={{ x: 0, y: 0, scale: 1.0 }}
        animate={{ x: slide.dx, y: slide.dy, scale: 1.08 }}
        transition={{ duration: KEN_DURATION, ease: "linear" }}
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
  const [index,     setIndex]    = useState(0)
  const [isMounted, setMounted]  = useState(false)
  const [isMobile,  setIsMobile] = useState(false)
  const firstDoneRef = useRef(false)

  // Detect mobile on mount + on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Preload all images on mount
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

  const isCinematic = index === 0 && !firstDoneRef.current

  // On mobile: reduce outer inset to avoid iOS Chrome overflow/clipping
  const outerInset = isMobile ? "-8%" : "-20%"

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: outerInset,
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
          isMobile={isMobile}
        />
      </AnimatePresence>

      {/* ── Gradient overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
          background: [
            "linear-gradient(to bottom,",
            "  rgba(10,31,68,0.82) 0%,",      // navbar safe area
            "  rgba(10,31,68,0.28) 38%,",
            "  rgba(10,31,68,0.20) 55%,",
            "  rgba(10,31,68,0.70) 100%",      // stats bar / bottom
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

      {/* Champagne glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 45% at 50% 22%, rgba(196,163,90,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Slide progress pills — desktop only ── */}
      {!isMobile && (
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
      )}

      {/* ── Destination label — responsive bottom position ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${index}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: "clamp(72px, 13vw, 108px)",   // responsive — tracks stats bar height
            left: 28,
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
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
            {["Rio de Janeiro", "Maldivas", "Santorini", "Tokyo", "Paris", "Patagônia"][index]}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
