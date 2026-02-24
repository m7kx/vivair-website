"use client"

import Lenis from "lenis"
import { useEffect } from "react"

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.0,
      lerp: 0.065,
    })

    let raf: number
    function animate(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
