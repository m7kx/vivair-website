"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const destinations = [
  "Lua de mel nas Maldivas",
  "Família na Disney",
  "Aniversário em Santorini",
  "Aventura pelo Japão",
  "Fim de semana em Buenos Aires",
  "Cruzeiro pelo Mediterrâneo",
]

export default function RotatingText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % destinations.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: "relative",
        height: "2em",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--heading-font)",
            fontStyle: "italic",
            fontWeight: 500,
            color: "rgba(250,249,246,0.95)",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
            textShadow: "0 1px 12px rgba(10,31,68,0.55), 0 0px 32px rgba(10,31,68,0.35)",
          }}
        >
          {destinations[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
