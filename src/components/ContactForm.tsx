"use client"

import { useState, useId, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ─────────────────────────── helpers ─────────────────────────────────── */

const MAX = { nome: 80, email: 120, telefone: 25, mensagem: 600 } as const

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

/** Applies Brazilian phone mask: +55(XX)XXXXX-XXXX
 *  Falls back to free input for international numbers (> BR range). */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")

  // If starts with 55 and has up to 13 digits → Brazilian mask
  if (digits.startsWith("55") && digits.length <= 13) {
    const d = digits.slice(2) // strip country code
    let r = "+55"
    if (d.length > 0) r += " (" + d.slice(0, 2)
    if (d.length > 2) r += ") " + d.slice(2, 7)
    if (d.length > 7) r += "-" + d.slice(7, 11)
    return r
  }

  // International or BR shorter – keep digits + original separators (free format)
  if (raw.startsWith("+")) return "+" + digits.slice(0, MAX.telefone - 1)
  return raw.slice(0, MAX.telefone)
}

function validateField(name: keyof typeof MAX, value: string): string {
  const v = value.trim()
  if (!v) {
    const labels: Record<keyof typeof MAX, string> = {
      nome: "Nome",
      email: "E-mail",
      telefone: "Telefone / WhatsApp",
      mensagem: "Mensagem",
    }
    return `${labels[name]} é obrigatório.`
  }
  if (name === "email" && !isValidEmail(v))
    return "Informe um e-mail válido – ex: nome@exemplo.com"
  if (name === "telefone" && v.replace(/\D/g, "").length < 8)
    return "Número muito curto. Verifique o telefone."
  if (value.length > MAX[name])
    return `Máximo de ${MAX[name]} caracteres atingido.`
  return ""
}

/* ─────────────────────────── error hint ──────────────────────────────── */

function ErrorHint({ msg }: { msg: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          key={msg}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            marginTop: 6,
            paddingLeft: 4,
            fontSize: 12.5,
            fontFamily: "\'DM Sans\', sans-serif",
            color: "rgba(255,140,120,0.92)",
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="9" stroke="rgba(255,140,120,0.7)" strokeWidth="1.5"/>
            <path d="M10 6v5M10 14h.01" stroke="rgba(255,140,120,0.85)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────── floating field ──────────────────────────── */

interface FieldProps {
  label: string
  name: keyof typeof MAX
  type?: string
  placeholder: string
  multiline?: boolean
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  index: number
  showCounter?: boolean
}

function FloatingField({
  label, name, type = "text", placeholder, multiline = false,
  value, onChange, onBlur, error, index, showCounter = false,
}: FieldProps) {
  const [focused, setFocused] = useState(false)
  const id = useId()
  const active = focused || value.length > 0
  const hasError = !!error

  const fieldStyle: React.CSSProperties = {
    background: "rgba(26, 58, 110, 0.35)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${
      hasError
        ? "rgba(255,140,120,0.55)"
        : active
        ? "rgba(200,169,110,0.7)"
        : "rgba(200,169,110,0.22)"
    }`,
    borderRadius: 12,
    color: "#f5f0e8",
    fontFamily: "\'DM Sans\', sans-serif",
    fontSize: 16,
    padding: multiline ? "28px 20px 14px" : "24px 20px 10px",
    width: "100%",
    outline: "none",
    resize: "none" as const,
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: hasError
      ? "0 0 0 3px rgba(255,140,120,0.10)"
      : active
      ? "0 0 0 3px rgba(200,169,110,0.12)"
      : "none",
    minHeight: multiline ? 140 : "auto",
    boxSizing: "border-box" as const,
  }

  const max = MAX[name]

  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, x: -24 },
        visible: (i: number) => ({
          opacity: 1, x: 0,
          transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{ position: "relative" }}
    >
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={
          active
            ? { y: -14, scale: 0.8, color: hasError ? "rgba(255,140,120,0.85)" : "rgba(200,169,110,0.9)" }
            : { y: 0, scale: 1, color: "rgba(245,240,232,0.45)" }
        }
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: multiline ? 16 : 17,
          left: 20,
          fontFamily: "\'DM Sans\', sans-serif",
          fontSize: 15,
          fontWeight: 500,
          pointerEvents: "none",
          transformOrigin: "left center",
          zIndex: 1,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          placeholder={focused ? placeholder : ""}
          maxLength={max}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          onChange={(e) => onChange(e.target.value)}
          style={fieldStyle}
          rows={5}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={focused ? placeholder : ""}
          maxLength={max}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          onChange={(e) => onChange(e.target.value)}
          style={fieldStyle}
        />
      )}

      {/* Character counter (message field only) */}
      {showCounter && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
            paddingInline: 2,
          }}
        >
          <ErrorHint msg={error ?? ""} />
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              fontFamily: "\'DM Sans\', sans-serif",
              color: value.length > max * 0.9
                ? "rgba(255,140,120,0.8)"
                : "rgba(245,240,232,0.3)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value.length}/{max}
          </span>
        </div>
      )}

      {/* Error hint (non-counter fields) */}
      {!showCounter && <ErrorHint msg={error ?? ""} />}
    </motion.div>
  )
}

/* ─────────────────────────── ContactLink ─────────────────────────────── */

interface ContactLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  iconColor: string
  target?: string
}

function ContactLink({ href, label, icon, iconColor, target = "_blank" }: ContactLinkProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        textDecoration: "none",
        fontFamily: "\'DM Sans\', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.01em",
        color: hovered ? "#f5f0e8" : "rgba(245,240,232,0.55)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "color 0.22s ease, transform 0.22s ease",
        position: "relative",
        paddingBottom: 2,
      }}
    >
      {/* Icon wrapper – glow on hover */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          filter: hovered ? `drop-shadow(0 0 6px ${iconColor})` : "none",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          transition: "filter 0.25s ease, transform 0.25s ease",
        }}
      >
        {icon}
      </span>

      {/* Label with slide-in underline */}
      <span style={{ position: "relative" }}>
        {label}
        <span
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            height: 1,
            width: "100%",
            background: iconColor,
            borderRadius: 2,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: hovered ? "left" : "right",
            transition: "transform 0.25s ease",
            display: "block",
          }}
        />
      </span>
    </a>
  )
}

/* ─────────────────────────── main form ───────────────────────────────── */

type Fields = { nome: string; email: string; telefone: string; mensagem: string }
type Errors = Partial<Record<keyof Fields, string>>

export default function ContactForm() {
  const [form, setForm] = useState<Fields>({ nome: "", email: "", telefone: "", mensagem: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Touch field on blur for per-field validation
  const touch = (field: keyof Fields) => () => {
    setTouched((p) => ({ ...p, [field]: true }))
    setErrors((p) => ({ ...p, [field]: validateField(field, form[field]) || undefined }))
  }

  const set = (key: keyof Fields) => (v: string) => {
    setForm((p) => ({ ...p, [key]: v }))
    // Clear error live once valid
    if (touched[key]) {
      setErrors((p) => ({ ...p, [key]: validateField(key, v) || undefined }))
    }
  }

  const setPhone = (raw: string) => {
    const formatted = formatPhone(raw)
    set("telefone")(formatted)
  }

  const validate = (): boolean => {
    const e: Errors = {}
    let valid = true
    ;(Object.keys(MAX) as (keyof typeof MAX)[]).forEach((k) => {
      const field = k === "mensagem" ? k : k as keyof Fields
      const err = validateField(field, form[field] ?? "")
      if (err) { e[field] = err; valid = false }
    })
    setErrors(e)
    setTouched({ nome: true, email: true, telefone: true, mensagem: true })
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    try {
      const res = await fetch("https://formsubmit.co/ajax/contato@vivairtravel.com.br", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          mensagem: form.mensagem,
          _subject: `✦ Nova Whycation: ${form.nome}`,
          _replyto: form.email,
          _captcha: "false",
          _template: "table",
        }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      if (data.success !== "true" && data.success !== true) throw new Error("rejected")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      style={{
        background: "linear-gradient(155deg, #0a1f44 0%, #1a3a6e 100%)",
        padding: "80px 24px 100px",
        minHeight: "60vh",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <p style={{
            fontFamily: "var(--btn-font, \'DM Sans\', sans-serif)",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(200,169,110,0.8)", marginBottom: 12,
          }}>
            Vamos Conversar
          </p>
          <h2 style={{
            fontFamily: "\'DM Serif Display\', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 400,
            color: "#f5f0e8", lineHeight: 1.2, marginBottom: 14,
          }}>
            Envie Sua Mensagem
          </h2>
          <p style={{
            fontFamily: "\'Outfit\', \'DM Sans\', sans-serif", fontSize: 15,
            color: "rgba(245,240,232,0.6)", lineHeight: 1.6,
            maxWidth: 480, margin: "0 auto",
          }}>
            Qual é o propósito da sua próxima aventura? Conte-nos – e
            criaremos uma Whycation feita para você.
          </p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textAlign: "center", padding: "60px 24px",
                background: "rgba(26,58,110,0.35)", backdropFilter: "blur(16px)",
                borderRadius: 20, border: "1px solid rgba(200,169,110,0.3)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(200,169,110,0.18)",
                  border: "1.5px solid rgba(200,169,110,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="rgba(200,169,110,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <h3 style={{
                fontFamily: "\'DM Serif Display\', Georgia, serif",
                fontSize: "1.6rem", color: "#f5f0e8", marginBottom: 10, fontWeight: 400,
              }}>
                Recebemos seu porquê. ✦
              </h3>
              <p style={{
                fontFamily: "\'Outfit\', sans-serif", fontSize: 15,
                color: "rgba(245,240,232,0.6)", lineHeight: 1.65,
              }}>
                Nosso time vai traçar sua rota e entrar em contato em breve.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              exit={{ opacity: 0 }}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Honeypot – visually hidden, bots fill it, humans don't */}
              <input
                type="text"
                name="_honey"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{
                  position: "absolute", left: "-9999px",
                  width: 1, height: 1, opacity: 0, pointerEvents: "none",
                }}
                defaultValue=""
              />

              {/* Row: Nome + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FloatingField
                  label="Nome completo" name="nome" value={form.nome}
                  onChange={set("nome")} onBlur={touch("nome")}
                  placeholder="Seu nome completo"
                  error={errors.nome} index={0}
                />
                <FloatingField
                  label="E-mail" name="email" type="email" value={form.email}
                  onChange={set("email")} onBlur={touch("email")}
                  placeholder="nome@exemplo.com"
                  error={errors.email} index={1}
                />
              </div>

              {/* Telefone */}
              <FloatingField
                label="Tel / WhatsApp" name="telefone" type="tel" value={form.telefone}
                onChange={setPhone} onBlur={touch("telefone")}
                placeholder="+55(21)99683-0000"
                error={errors.telefone} index={2}
              />

              {/* Mensagem com contador */}
              <FloatingField
                label="Seu Porquê – Motivação da Viagem" name="mensagem"
                value={form.mensagem}
                onChange={set("mensagem")} onBlur={touch("mensagem")}
                placeholder="Aniversário de casamento? Primeira viagem em família? Fuga da rotina? Conte-nos..."
                multiline error={errors.mensagem} index={3} showCounter
              />

              {/* Submit error */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      color: "rgba(255,140,120,0.85)", fontSize: 14,
                      fontFamily: "\'DM Sans\', sans-serif", textAlign: "center",
                    }}
                  >
                    Algo deu errado. Tente novamente ou fale pelo WhatsApp.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CTA */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(200,169,110,1)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginTop: 8, padding: "16px 40px",
                  borderRadius: "var(--btn-radius, 100px)",
                  background: status === "loading" ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.85)",
                  color: "#0a1f44",
                  fontFamily: "var(--btn-font, \'DM Sans\', sans-serif)",
                  fontSize: 15, fontWeight: 700, border: "none",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em",
                  alignSelf: "center", minWidth: 240,
                }}
              >
                {status === "loading" ? "Enviando..." : "Iniciar Minha Whycation →"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer info – contact links with icons + hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            textAlign: "center", marginTop: 52,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}
        >
          {/* WhatsApp */}
          <ContactLink
            href="https://wa.me/5521996832196"
            label="+55 (21) 99683-2196"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.405A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z"
                  fill="#25D366"
                />
                <path
                  d="M8.5 8.5c.2-.45.55-.5.9-.5h.4c.3 0 .55.2.65.45l.75 1.8c.1.25.05.55-.1.75l-.5.55c-.05.1-.05.2 0 .3.35.65.82 1.22 1.4 1.7.15.13.3.1.42-.02l.5-.5c.2-.2.5-.25.75-.1l1.8.85c.25.12.4.38.38.65v.42c-.02.5-.25.9-.6 1.15-.5.33-1.15.45-1.8.3-1.5-.35-2.85-1.2-3.85-2.4-.85-1-1.35-2.2-1.4-3.4-.03-.6.12-1.2.45-1.6Z"
                  fill="white"
                />
              </svg>
            }
            iconColor="#25D366"
          />

          {/* Email */}
          <ContactLink
            href="mailto:contato@vivairtravel.com.br"
            label="contato@vivairtravel.com.br"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(200,169,110,0.9)" strokeWidth="1.6"/>
                <path
                  d="M2 7l9.293 6.293a1 1 0 0 0 1.414 0L22 7"
                  stroke="rgba(200,169,110,0.9)" strokeWidth="1.6" strokeLinecap="round"
                />
              </svg>
            }
            iconColor="rgba(200,169,110,0.9)"
          />

          {/* Instagram */}
          <ContactLink
            href="https://instagram.com/vivair.travel"
            label="@vivair.travel"
            target="_blank"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f09433"/>
                    <stop offset="25%" stopColor="#e6683c"/>
                    <stop offset="50%" stopColor="#dc2743"/>
                    <stop offset="75%" stopColor="#cc2366"/>
                    <stop offset="100%" stopColor="#bc1888"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-grad)" strokeWidth="1.7"/>
                <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="1.6"/>
                <circle cx="17.5" cy="6.5" r="1.1" fill="url(#ig-grad)"/>
              </svg>
            }
            iconColor="#e1306c"
          />
        </motion.div>
      </div>
    </section>
  )
}
