"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionValue } from "framer-motion"

interface Slide {
  url: string
  urlMobile?: string  // Optional portrait asset — when provided, overrides mobileX crop
  dx: number          // Ken Burns horizontal drift (px)
  dy: number          // Ken Burns vertical drift (px)
  yOffset?: number    // Desktop vertical crop (px). Formula: top_row ≈ (255.6 − yOffset) / 1411.2 × 1071
  mobileX: string     // Mobile horizontal pan (0%–100%). Formula: (subjectCol × 0.869 − 215) / 1239 × 100
  desktopPos: string  // object-position for desktop — only horizontal % has effect (vertical = no-op)
  label: string
}

// ── All hero images: 1920×1071 (ratio 1.793) ────────────────────────────────
// Desktop  — Ken Burns container ratio ~1.60 → cover fills HEIGHT → vertical object-position useless.
//            Use `yOffset` (px) to shift which rows are visible. +px = expose top, −px = expose bottom.
// Mobile   — Portrait container ratio ~0.46 → cover fills HEIGHT → massive horizontal overflow.
//            Use `mobileX` (%) to pan left/right. Vertical is nearly full-image, no offset needed.
const SLIDES: Slide[] = [
  {
    url: "/hero/hero-rio.jpg",
    dx: 18, dy: -12, yOffset: 160, // row ~80  → céu dourado + Pão de Açúcar + baía
    mobileX: "63%",                 // col ~1150 → Pão de Açúcar centrado
    desktopPos: "center 0%",
    label: "Rio de Janeiro",
  },
  {
    url: "/hero/hero-maldivas.jpg",
    dx: -16, dy: -8, yOffset: 100, // row ~136 → nuvens do pôr do sol + bungalows + água turquesa
    mobileX: "50%",                 // col ~960  → bungalows centrados (simétrico)
    desktopPos: "center center",
    label: "Maldivas",
  },
  {
    url: "/hero/hero-santorini.jpg",
    dx: 14, dy: -10, yOffset: 80,  // row ~155 → céu noturno + cúpulas azuis + mar
    mobileX: "32%",                 // col ~700  → cúpula azul centrada
    desktopPos: "60% center",
    label: "Santorini",
  },
  {
    url: "/hero/hero-tokyo.jpg",
    dx: -18, dy: 10, yOffset: 125, // row ~107 → cerejeiras emoldurando + Torre de Tokyo + skyline
    mobileX: "39%",                 // col ~800  → Torre de Tokyo centrada
    desktopPos: "40% center",
    label: "Tokyo",
  },
  {
    url: "/hero/hero-paris.jpg",
    dx: 20, dy: -8, yOffset: 70,   // row ~141 → Torre Eiffel (corpo) + céu dourado + edifícios
    mobileX: "28%",                 // col ~640  → Torre Eiffel centrada
    desktopPos: "40% center",
    label: "Paris",
  },
  {
    url: "/hero/hero-dubai.jpg",
    dx: -16, dy: -10, yOffset: -166, // row ~320 → horizon golden glow + full skyline + Burj Khalifa
    mobileX: "52%",                   // col ~975  → Burj Khalifa ligeiramente à direita do centro — skyline balanceado
    desktopPos: "center 0%",
    label: "Dubai",
  },
  {
    url: "/hero/hero-patagonia.jpg",
    dx: -14, dy: -12, yOffset: 100, // row ~118 → picos Torres del Paine + lago + deck
    mobileX: "10%",                  // col ~390  → cabana à esq. + montanhas ao fundo
    desktopPos: "center center",
    label: "Patagônia",
  },
]

const SLIDE_DURATION = 7000
const CROSSFADE_S    = 2.5
const ENTRANCE_S     = 2.0
const KEN_DURATION   = SLIDE_DURATION / 1000

// ── Single slide item ────────────────────────────────────────────────────────
function SlideItem({
  slide,
  isCinematic,
  isMobile,
  isFirst,
}: {
  slide: Slide
  isCinematic: boolean
  isMobile: boolean
  isFirst: boolean
}) {
  const imgSrc    = isMobile && slide.urlMobile ? slide.urlMobile : slide.url
  const innerInset = isMobile ? "-2%" : "-6%"
  const endScale   = isMobile ? 1.02  : 1.08
  const dxFinal    = isMobile ? slide.dx * 0.35 : slide.dx
  const dyFinal    = isMobile ? slide.dy * 0.35 : slide.dy
  const yBase      = isMobile ? 0 : (slide.yOffset ?? 0)
  const objPos     = isMobile
    ? (slide.urlMobile ? "center center" : `${slide.mobileX} center`)
    : slide.desktopPos

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
        opacity: { duration: isCinematic ? ENTRANCE_S : CROSSFADE_S,              ease: [0.25, 0.46, 0.45, 0.94] },
        scale:   { duration: isCinematic ? ENTRANCE_S : CROSSFADE_S * 0.9,        ease: [0.25, 0.46, 0.45, 0.94] },
        filter:  { duration: isCinematic ? ENTRANCE_S * 0.75 : CROSSFADE_S * 0.7, ease: "easeOut" },
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Ken Burns wrapper — scale + drift independent of fade */}
      <motion.div
        key={slide.url}
        style={{ position: "absolute", inset: innerInset, willChange: "transform" }}
        initial={{ x: 0, y: yBase, scale: 1.0 }}
        animate={{ x: dxFinal, y: yBase + dyFinal, scale: endScale }}
        transition={{ duration: KEN_DURATION, ease: "linear" }}
      >
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading={isFirst ? "eager" : "lazy"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: objPos,
            userSelect: "none",
            pointerEvents: "none",
            display: "block",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// ── Main HeroBackground ──────────────────────────────────────────────────────
export default function HeroBackground({
  y,
  scale: scrollScale,
}: {
  y?: MotionValue<string>
  scale?: MotionValue<number>
}) {
  const [index,     setIndex]   = useState(0)
  const [isMounted, setMounted] = useState(false)
  const [isMobile,  setIsMobile] = useState(false)
  const firstDoneRef = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setMounted(true)
    SLIDES.forEach((s) => {
      const img = new window.Image()
      img.src = s.url
    })
  }, [])

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
    const onVis = () => document.visibilityState === "hidden" ? stop() : start()
    start()
    document.addEventListener("visibilitychange", onVis)
    return () => {
      stop()
      clearTimeout(entranceTimer)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [isMounted])

  const isCinematic = index === 0 && !firstDoneRef.current
  const outerInset  = isMobile ? "-3%" : "-20%"

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
          isFirst={index === 0}
        />
      </AnimatePresence>

      {/* ── Gradient overlay ──  */}
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

      {/* ── Destination label ── */}
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
            {SLIDES[index].label}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
