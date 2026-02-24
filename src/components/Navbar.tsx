"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const LINKS = [
  { label: "Início",       href: "#" },
  { label: "Destinos",     href: "#destinos" },
  { label: "Experiências", href: "#" },
  { label: "Sobre",        href: "#" },
  { label: "Contato",      href: "/contato" },
]

/* ── Magnetic link with underline ───────────────────────────────────────── */
function NavLink({ label, href, index }: { label: string; href: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index + 0.3,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: "relative",
        fontFamily: "var(--nav-font)",
        fontSize: 14,
        fontWeight: 500,
        color: hovered ? "rgba(250,249,246,0.98)" : "rgba(250,249,246,0.65)",
        textDecoration: "none",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        padding: "4px 0",
        transition: "color 0.22s ease",
        display: "inline-block",
      }}
    >
      {label}

      {/* Underline — champagne, slides in from left */}
      <motion.span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          height: 1.5,
          width: "100%",
          background: "var(--p-champagne)",
          borderRadius: 2,
          scaleX: hovered ? 1 : 0,
          originX: hovered ? 0 : 1,
          display: shouldReduceMotion ? "none" : "block",
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  )
}

/* ── Hamburger button ────────────────────────────────────────────────────── */
function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      className="hamburger-btn"
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "8px", display: "flex", flexDirection: "column",
        gap: 5, justifyContent: "center", alignItems: "center",
        width: 40, height: 40,
      }}
    >
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "block", width: 22, height: 2, background: "white", borderRadius: 2 }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ display: "block", width: 22, height: 2, background: "white", borderRadius: 2 }}
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "block", width: 22, height: 2, background: "white", borderRadius: 2 }}
      />
    </button>
  )
}

/* ── Main Navbar ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* ── Bar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "sticky", top: 0, zIndex: 1000,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: scrolled ? "rgba(10,31,68,0.97)" : "rgba(10,31,68,0.88)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          transition: "background 0.4s ease",
          willChange: "transform",
        }}
      >
        {/* Champagne shimmer line at top when scrolled */}
        <motion.div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(196,163,90,0.6), transparent)",
          }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center",
          height: 64,
        }} className="nav-inner-row">

          {/* Left spacer — matches FloatingLogo width so nav feels balanced */}
          <div className="desktop-nav" style={{ width: 68, flexShrink: 0 }} />

          {/* Desktop nav — centered */}
          <div
            className="desktop-nav"
            style={{ display: "flex", gap: 32, alignItems: "center" }}
          >
            {LINKS.map((l, i) => (
              <NavLink key={l.label} label={l.label} href={l.href} index={i} />
            ))}
          </div>

          {/* CTA button — desktop only */}
          <motion.a
            className="desktop-nav"
            href="https://app.onertravel.com/vivairtraveldesign/home"
            target="_blank" rel="noopener noreferrer"
            style={{
              background: "var(--grad-cta)", color: "white",
              padding: "10px 22px", borderRadius: "var(--btn-radius)",
              fontFamily: "var(--btn-font)", fontSize: 14,
              fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Reserve Online
          </motion.a>

          {/* Hamburger — always visible */}
          <div className="hamburger-btn">
            <HamburgerButton open={open} onClick={() => setOpen(!open)} />
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 98,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                top: 64,
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: 64, left: 0, right: 0,
                zYndex: 99,
                background: "rgba(10,31,68,0.99)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "24px 24px 32px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontFamily: "var(--nav-font)", fontSize: 17, fontWeight: 500,
                      color: "rgba(250,249,246,0.8)", textDecoration: "none",
                      padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
                      display: "block",
                    }}
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  href="https://app.onertravel.com/vivairtraveldesign/home"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: LINKS.length * 0.06 + 0.05, duration: 0.35 }}
                  style={{
                    marginTop: 16, background: "var(--grad-cta)", color: "white",
                    padding: "14px 24px", borderRadius: "var(--btn-radius)",
                    fontFamily: "var(--btn-font)", fontSize: 15, fontWeight: 600,
                    textDecoration: "none", textAlign: "center", display: "block",
                  }}
                >
                  Reserve Online
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: none !important; }
        .hamburger-btn { display: flex !important; }
        .nav-inner-row { justify-content: flex-end; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: flex !important; }
          .nav-inner-row { justify-content: space-between; }
        }
      `}</style>
    </>
  )
}
