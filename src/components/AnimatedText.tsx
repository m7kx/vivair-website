"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  stagger?: number
  once?: boolean
  tag?: "h1" | "h2" | "h3" | "p" | "span"
}

export default function AnimatedText({
  text,
  style,
  delay = 0,
  stagger = 0.07,
  once = true,
  tag: Tag = "p",
}: AnimatedTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 24, rotateX: -15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 18,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.28em 0",
        perspective: 600,
        ...style,
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{ display: "inline-block", marginRight: "0.28em", willChange: "transform" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
