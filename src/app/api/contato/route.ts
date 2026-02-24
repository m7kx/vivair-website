import { NextRequest, NextResponse } from "next/server"

/* ──────────────────────────────────────────────────────────
   POST /api/contato
   - Validates required fields
   - Sends WhatsApp notification via webhook (env: WA_WEBHOOK_URL)
   - Optional: Resend email (env: RESEND_API_KEY, RESEND_TO)
   ────────────────────────────────────────────────────────── */

interface ContactPayload {
  nome: string
  email: string
  telefone: string
  porcque: string
}

function buildWhatsAppText({ nome, email, telefone, porcque }: ContactPayload): string {
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
  const body = (await req.json()) as Partial<ContactPayload>
  const { nome, email, telefone, porcque } = body

  // Validation
  if (!nome?.trim() || !email?.trim() || !telefone?.trim() || !porcque?.trim()) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 }
    )
  }

  const payload: ContactPayload = {
    nome: nome.trim(),
    email: email.trim(),
    telefone: telefone.trim(),
    porcque: porcque.trim(),
  }

  const errors: string[] = []

  /* ── 1. WhatsApp Business Webhook notification ── */
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
      if (!waRes.ok) {
        errors.push(`WhatsApp webhook error: ${waRes.status}`)
      }
    } catch (err) {
      errors.push(`WhatsApp webhook failed: ${String(err)}`)
      console.error("[contato] WhatsApp webhook error:", err)
    }
  }

  /* ── 2. Resend email (optional) ── */
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
          from: "site@vivairtravel.com.br",
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
      if (!emailRes.ok) {
        errors.push(`Resend error: ${emailRes.status}`)
      }
    } catch (err) {
      errors.push(`Resend failed: ${String(err)}`)
      console.error("[contato] Resend error:", err)
    }
  }

  /* ── 3. Always log server-side ── */
  console.log("[contato] New submission:", {
    nome: payload.nome,
    email: payload.email,
    telefone: payload.telefone,
    porcqueLength: payload.porcque.length,
    errors,
  })

  // Return success even if notifications had soft errors
  // (submission is saved in logs, notifications are best-effort)
  return NextResponse.json({ success: true, warnings: errors.length > 0 ? errors : undefined })
}
