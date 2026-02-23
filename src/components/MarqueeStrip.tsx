"use client"

import { motion } from "framer-motion"

const ITEMS = [
  "✦ Maldivas",
  "✦ Paris",
  "✦ Dubai",
  "✦ Tokyo",
  "✦ Santorini",
  "✦ Nova York",
  "✦ Bali",
  "✦ Lisboa",
  "✦ Toscana",
  "✦ Patagônia",
]

export default function MarqueeStrip({
  direction = "left",
  speed = 40,
  bg = "var(--surface-dark)",
  color = "var(--on-dark-accent)",
}: {
  direction?: "left" | "right"
  speed?: number
  bg?: string
  color?: string
}) {
  const items = [...ITEMS, ...ITEMS]

  return (
    <div
      style={{
        overflow: "hidden",
        background: bg,
        borderTop: "1px solid rgba(250,249,246,0.06)",
        borderBottom: "1px solid rgba(250,249,246,0.06)",
        padding: "18px 0",
        userSelect: "none",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          gap: 0,
          width: "max-content",
        }}
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color,
              paddingRight: 64,
              whiteSpace: "nowrap",
              fontFamily: "var(--heading-font)",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
