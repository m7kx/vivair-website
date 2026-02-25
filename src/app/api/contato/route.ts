import { NextRequest, NextResponse } from "next/server"

/* ──────────────────────────────────────────────────────────
   POST /api/contato
   Security layers:
     1. Honeypot field (_hp) — bots fill it, humans don't
     2. Timing check (_t)   — submissions < 1.5s from page load = bot
     3. In-memory rate limit — max 3 req / IP / hour
     4. Server-side field validation (mirrors client rules)
   ────────────────────────────────────────────────────────── */

interface ContactPayload {
  nome: string
  email: string
  telefone: string
  porcque: string
  _hp?: string      // honeypot
  _t?: number       // page mount timestamp
}

/* ── Rate limiting (in-memory, resets on cold start) ── */
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

/* ── Validators ── */
const MAX = { nome: 80, email: 120, telefone: 25, porcque: 600 }

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

function buildWhatsAppText({ nome, email, telefone, porcque }: Omit<ContactPayload, "_hp" | "_t">): string {
  return (
    `*✦ Nova Whycation — VivAir*\n\n` +
    `*Nome:* ${nome}\n` +
    `*E-mail:* ${email}\n` +
    `*Telefone:* ${telefone}\n\n` +
    `*Porquê (Motivação):*\n${porcque}\n\n` +
    `_Responda para iniciar o atendimento._`
  )
}

export async function POST(req: NextRequest) {
  /* ── 1. Rate limit ── */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 }
    )
  }

  const body = (await req.json()) as Partial<ContactPayload>
  const { nome, email, telefone, porcque, _hp, _t } = body

  /* ── 2. Honeypot ── */
  if (_hp && _hp.trim().length > 0) {
    // Silently accept (don't signal to bot that it was caught)
    return NextResponse.json({ success: true })
  }

  /* ── 3. Timing check (< 1500ms = bot) ── */
  if (_t && Date.now() - _t < 1500) {
    return NextResponse.json({ success: true }) // silent reject
  }

  /* ── 4. Field validation ── */
  if (!nome?.trim() || !email?.trim() || !telefone?.trim() || !porcque?.trim()) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 })
  }

  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 })
  }

  if (nome.trim().length > MAX.nome || email.trim().length > MAX.email ||
      telefone.trim().length > MAX.telefone || porcque.trim().length > MAX.porcque) {
    return NextResponse.json({ error: "Conteúdo excede o limite permitido." }, { status: 400 })
  }

  if (telefone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Telefone inválido." }, { status: 400 })
  }

  const payload = {
    nome: nome.trim(),
    email: email.trim(),
    telefone: telefone.trim(),
    porcque: porcque.trim(),
  }

  const errors: string[] = []

  /* ── 5. WhatsApp Business Webhook ── */
  const waWebhookUrl = process.env.WA_WEBHOOK_URL
  if (waWebhookUrl) {
    try {
      const waRes = await fetch(waWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: process.env.WA_NOTIFY_PHONE ?? "5521996832196",
          message: buildWhatsAppText(payload),
        }),
      })
      if (!waRes.ok) errors.push(`WhatsApp webhook error: ${waRes.status}`)
    } catch (err) {
      errors.push(`WhatsApp webhook failed: ${String(err)}`)
      console.error("[contato] WhatsApp webhook error:", err)
    }
  }

  /* ── 6. Resend email (optional) ── */
  const resendKey = process.env.RESEND_API_KEY
  const resendTo = process.env.RESEND_TO ?? "reservas@vivairtravel.com.br"
  if (resendKey) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
          to: [resendTo],
          subject: `✦ Nova Whycation: ${payload.nome}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a1f44;color:#f5f0e8;border-radius:12px">
              <h2 style="color:#c8a96e;margin-bottom:24px">✦ Nova Whycation — VivAir</h2>
              <p><strong>Nome:</strong> ${payload.nome}</p>
              <p><strong>E-mail:</strong> ${payload.email}</p>
              <p><strong>Telefone:</strong> ${payload.telefone}</p>
              <hr style="border-color:rgba(200,169,110,0.25);margin:20px 0"/>
              <p><strong>Porquê (Motivação):</strong></p>
              <blockquote style="border-left:3px solid #c8a96e;margin:0;padding:12px 16px;color:rgba(245,240,232,0.8)">
                ${payload.porcque}
              </blockquote>
            </div>
          `,
        }),
      })
      if (!emailRes.ok) errors.push(`Resend error: ${emailRes.status}`)
    } catch (err) {
      errors.push(`Resend failed: ${String(err)}`)
      console.error("[contato] Resend error:", err)
    }
  }

  /* ── 7. Log ── */
  console.log("[contato] New submission:", {
    nome: payload.nome, email: payload.email,
    telefone: payload.telefone, porcqueLength: payload.porcque.length,
    ip, errors,
  })

  return NextResponse.json({ success: true, warnings: errors.length > 0 ? errors : undefined })
}
