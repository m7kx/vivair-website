"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionValue } from "framer-motion"

interface Slide {
  url: string
  dx: number            // Ken Burns horizontal drift (px) — desktop
  dy: number            // Ken Burns vertical drift (px)   — desktop
  desktopPos: string    // backgroundPosition on desktop/tablet (≥768px)
  mobilePos: string     // backgroundPosition on mobile (<768px)
}

// 6 destinos VivAir — fotos editoriais geradas via Gemini Imagen 3 (2K, 16:9)
// Focal points auditados por análise de composição — Wave 5 QA v3
const SLIDES: Slide[] = [
  {
    url: "/hero/hero-rio.jpg",       // Botafogo golden hour — Pão de Açúcar centro-direita
    dx: 18, dy: -12,
    desktopPos: "center 40%",        // horizonte + montanhas visíveis, menos prédios
    mobilePos: "80% center",         // shift direita: Pão de Açúcar no portrait
  },
  {
    url: "/hero/hero-maldivas.jpg",  // overwater bungalows sunset — composição simétrica
    dx: -16, dy: -8,
    desktopPos: "center 45%",        // horizonte + bangalôs no centro-alto
    mobilePos: "center center",      // simetria: sol + bangalôs centrados no portrait
  },
  {
    url: "/hero/hero-santorini.jpg", // blue domes blue hour — cúpulas centro-direita
    dx: 14, dy: -10,
    desktopPos: "60% center",        // cúpulas visíveis + espaço negativo esquerda p/ texto
    mobilePos: "75% center",         // prioriza cúpulas azuis no corte portrait
  },
  {
    url: "/hero/hero-tokyo.jpg",     // Torre de Tokyo — levemente esquerda do centro
    dx: -18, dy: 10,
    desktopPos: "40% center",        // torre levemente esquerda, espaço negativo direita
    mobilePos: "38% center",         // trava Torre de Tokyo no corte portrait
  },
  {
    url: "/hero/hero-paris.jpg",     // Eiffel Tower golden hour — levemente esquerda
    dx: 20, dy: -8,
    desktopPos: "40% center",        // Torre Eiffel visível, moldura de prédios preservada
    mobilePos: "33% center",         // garante torre no corte vertical portrait
  },
  {
    url: "/hero/hero-patagonia.jpg", // Torres del Paine sunrise — deck + cadeiras esquerda
    dx: -14, dy: -12,
    desktopPos: "center 60%",        // montanhas no topo + deck no primeiro plano
    mobilePos: "20% center",         // deck + cadeiras visíveis no corte portrait
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

  // Mobile: dezoom — cover já escala 16:9 → portrait de forma agressiva;
  // reduzir inset e scale evita zoom excessivo e melhora enquadramento.
  const innerInset  = isMobile ? "-2%" : "-6%"
  const endScale    = isMobile ? 1.02  : 1.08
  const dxFinal     = isMobile ? slide.dx * 0.35 : slide.dx
  const dyFinal     = isMobile ? slide.dy * 0.35 : slide.dy

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
          inset: innerInset,
          backgroundImage: `url(${slide.url})`,
          backgroundSize: "cover",
          backgroundPosition: bgPos,
          backgroundRepeat: "no-repeat",
          willChange: "transform",
        }}
        initial={{ x: 0, y: 0, scale: 1.0 }}
        animate={{ x: dxFinal, y: dyFinal, scale: endScale }}
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

  // Cycle slides — pause when tab hidden to avoid stale timer accumulation
  useEffect(() => {
    if (!isMounted) return
    const entranceTimer = setTimeout(() => { firstDoneRef.current = true }, ENTRANCE_S * 1000 + 500)
    let interval: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (interval) return
      interval = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_DURATION)
    }
    const stop = () => {
      if (interval) { clearInterval(interval); interval = null }
    }
    const onVisibility = () => document.visibilityState === "hidden" ? stop() : start()
    start()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      stop()
      clearTimeout(entranceTimer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [isMounted])

  const isCinematic = index === 0 && !firstDoneRef.current

  // Mobile: outer inset menor → menos zoom headroom → imagem aparece mais "distante"
  const outerInset = isMobile ? "-3%" : "-20%"

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
      <AnimatePresence initial={false}>
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
            "  rgba(10,31,68,0.82) 0%,",
            "  rgba(10,31,68,0.28) 38%,",
            "  rgba(10,31,68,0.20) 55%,",
            "  rgba(10,31,68,0.70) 100%",
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
            bottom: "clamp(72px, 13vw, 108px)",
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
