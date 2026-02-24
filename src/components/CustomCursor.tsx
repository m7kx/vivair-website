"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type CursorState = "default" | "hover" | "link" | "drag"

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default")
  const [isVisible, setIsVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring physics — outer ring lags behind for premium feel
  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 }
  const dotX = useSpring(cursorX, { damping: 50, stiffness: 500, mass: 0.2 })
  const dotY = useSpring(cursorY, { damping: 50, stiffness: 500, mass: 0.2 })
  const ringX = useSpring(cursorX, springConfig)
  const ringY = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const onEnterLink = () => setCursorState("link")
    const onEnterHover = () => setCursorState("hover")
    const onLeaveInteractive = () => setCursorState("default")

    window.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Auto-detect interactive elements
    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink)
        el.addEventListener("mouseleave", onLeaveInteractive)
      })
    }

    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  const isHovered = cursorState === "link" || cursorState === "hover"

  return (
    <>
      {/* Dot — snappy, follows cursor closely */}
      <motion.div
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          zIndex: 99999,
          pointerEvents: "none",
          mixBlendMode: "difference",
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovered ? 8 : 6,
            height: isHovered ? 8 : 6,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            borderRadius: "50%",
            background: "#FAF9F6",
          }}
        />
      </motion.div>

      {/* Ring — lags behind for depth */}
      <motion.div
        style={{
          position: "fixed",
          left: ringX,
          top: ringY,
          zIndex: 99998,
          pointerEvents: "none",
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovered ? 48 : 32,
            height: isHovered ? 48 : 32,
            opacity: isVisible ? (isHovered ? 0.6 : 0.35) : 0,
            borderColor: isHovered ? "rgba(196,163,90,0.9)" : "rgba(250,249,246,0.5)",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          style={{
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "rgba(250,249,246,0.5)",
          }}
        />
      </motion.div>
    </>
  )
}
