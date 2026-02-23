"use client"

import { useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════
   VIVAIR DESIGN SYSTEM DASHBOARD v2.1
   Rota: /design-system
   ═══════════════════════════════════════════════════════════ */

type FontKey = 'dm-sans' | 'outfit' | 'inter' | 'plus-jakarta'
type PaletteKey = 'navy' | 'forest' | 'rose' | 'slate'

const FONTS: { key: FontKey; label: string; stack: string; url: string }[] = [
  { key: 'dm-sans',      label: 'DM Sans',           stack: "'DM Sans', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap' },
  { key: 'outfit',       label: 'Outfit',             stack: "'Outfit', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap' },
  { key: 'inter',        label: 'Inter',              stack: "'Inter', sans-serif",             url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
  { key: 'plus-jakarta', label: 'Plus Jakarta Sans',  stack: "'Plus Jakarta Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
]

const PALETTES: {
  key: PaletteKey; label: string; emoji: string
  navy: string; navyMid: string; accent: string; accentLt: string; amber: string; offWhite: string
}[] = [
  { key: 'navy',   label: 'VivAir Navy',  emoji: '🌊', navy: '#0a1f44', navyMid: '#234d90', accent: '#C4A35A', accentLt: '#D4A574', amber: '#C9856B', offWhite: '#FAF9F6' },
  { key: 'forest', label: 'Forest Green', emoji: '🌿', navy: '#0d2b1a', navyMid: '#1a4f2d', accent: '#8DB87A', accentLt: '#A6C99A', amber: '#C4955A', offWhite: '#F6FAF6' },
  { key: 'rose',   label: 'Rose Gold',    emoji: '🌸', navy: '#2b1018', navyMid: '#5c1f33', accent: '#C4876A', accentLt: '#D4A090', amber: '#B87A8D', offWhite: '#FAF6F7' },
  { key: 'slate',  label: 'Slate',        emoji: '🪨', navy: '#1a1f2b', navyMid: '#2e3a55', accent: '#8AA8C4', accentLt: '#9FB8D4', amber: '#7A95B8', offWhite: '#F6F8FA' },
]

function setTokens(vars: Record<string, string>) {
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export default function DesignSystemPage() {
  const [fontKey,    setFontKey]    = useState<FontKey>('dm-sans')
  const [paletteKey, setPaletteKey] = useState<PaletteKey>('navy')
  const [radius,     setRadius]     = useState(12)
  const [copied,     setCopied]     = useState('')

  const applyFont = useCallback((fk: FontKey) => {
    const f = FONTS.find(x => x.key === fk)!
    const id = `ds-font-${fk}`
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'; link.href = f.url
      document.head.appendChild(link)
    }
    setTokens({ '--p-font-primary': f.stack })
    setFontKey(fk)
  }, [])

  const applyPalette = useCallback((pk: PaletteKey) => {
    const p = PALETTES.find(x => x.key === pk)!
    setTokens({ '--p-navy': p.navy, '--p-navy-mid': p.navyMid, '--p-navy-lift': p.navyMid, '--p-champagne': p.accent, '--p-champagne-lt': p.accentLt, '--p-amber': p.amber, '--p-off-white': p.offWhite })
    setPaletteKey(pk)
  }, [])

  const applyRadius = useCallback((r: number) => {
    setTokens({ '--p-radius-sm': `${Math.max(4, r-4)}px`, '--p-radius': `${r}px`, '--p-radius-lg': `${r+4}px` })
    setRadius(r)
  }, [])

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key); setTimeout(() => setCopied(''), 1800)
  }

  const pal  = PALETTES.find(x => x.key === paletteKey)!
  const font = FONTS.find(x => x.key === fontKey)!

  const tokenSnippet = `:root {
  /* Palette: ${pal.label} */
  --p-navy:         ${pal.navy};
  --p-navy-mid:     ${pal.navyMid};
  --p-champagne:    ${pal.accent};
  --p-off-white:    ${pal.offWhite};

  /* Typography */
  --p-font-primary: ${font.stack};

  /* Radius */
  --p-radius:    ${radius}px;
  --p-radius-lg: ${radius + 4}px;
  --p-radius-sm: ${Math.max(4, radius - 4)}px;
}`

  const chip = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
    outline: active ? '2px solid var(--p-champagne)' : '1px solid rgba(255,255,255,0.18)',
    background: active ? 'rgba(196,163,90,0.15)' : 'rgba(255,255,255,0.06)',
    color: active ? 'var(--p-champagne)' : 'var(--on-dark-2)', transition: 'all 0.2s',
  })

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', borderRadius: 'var(--card-radius)', padding: 'var(--card-pad)',
    boxShadow: 'var(--card-shadow)', border: 'var(--border-light)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)', fontFamily: 'var(--body-font)' }}>

      {/* Sticky bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,31,68,0.96)', backdropFilter: 'blur(20px)', borderBottom: 'var(--border-dark)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 32, height: 72, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--on-dark-1)', letterSpacing: '-0.02em', flexShrink: 0 }}>VivAir / Design System</span>

          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-dark-3)', marginBottom: 6 }}>Fonte</div>
            <div style={{ display: 'flex', gap: 8 }}>{FONTS.map(f => <button key={f.key} onClick={() => applyFont(f.key)} style={chip(fontKey === f.key)}>{f.label}</button>)}</div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-dark-3)', marginBottom: 6 }}>Paleta</div>
            <div style={{ display: 'flex', gap: 8 }}>{PALETTES.map(p => <button key={p.key} onClick={() => applyPalette(p.key)} style={chip(paletteKey === p.key)}>{p.emoji} {p.label}</button>)}</div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-dark-3)', marginBottom: 6 }}>Radius: {radius}px</div>
            <input type="range" min={0} max={28} value={radius} onChange={e => applyRadius(Number(e.target.value))} style={{ accentColor: 'var(--p-champagne)', width: 120 }} />
          </div>

          <a href="/" style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 500, color: 'var(--on-dark-2)', textDecoration: 'none', flexShrink: 0 }}>← Voltar ao site</a>
        </div>
      </div>

      {/* Hero preview */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-dark)', padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-dark-accent)', marginBottom: 16 }}>Travel Design</p>
          <h1 style={{ fontFamily: 'var(--hero-font)', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 'var(--hero-weight)', color: 'var(--on-dark-1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>Sua próxima viagem começa com uma conversa</h1>
          <p style={{ fontSize: 18, fontWeight: 400, color: 'var(--on-dark-2)', marginBottom: 28 }}>Desenhamos experiências de viagem com a sua cara.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: 'var(--grad-cta)', color: 'white', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: 'none', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 600, cursor: 'pointer' }}>Desenhe sua viagem</button>
            <button style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--on-dark-1)', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: '1px solid rgba(255,255,255,0.25)', fontFamily: 'var(--btn-font)', fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>Reserve Online</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px' }}>

        {/* Colors */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Cores</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Navy (Primary)',  val: pal.navy,     varName: '--p-navy' },
            { label: 'Navy Mid',        val: pal.navyMid,  varName: '--p-navy-mid' },
            { label: 'Champagne',       val: pal.accent,   varName: '--p-champagne' },
            { label: 'Champagne Light', val: pal.accentLt, varName: '--p-champagne-lt' },
            { label: 'Amber',           val: pal.amber,    varName: '--p-amber' },
            { label: 'Off-White',       val: pal.offWhite, varName: '--p-off-white' },
          ].map(c => (
            <button key={c.varName} onClick={() => handleCopy(c.val, c.varName)}
              style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', border: copied === c.varName ? '2px solid var(--p-champagne)' : 'var(--border-light)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--p-radius-sm)', background: c.val, flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{copied === c.varName ? '✓ copiado!' : c.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{c.varName}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Gradients */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Gradientes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Hero BG',      grad: 'var(--grad-hero)', bg: '' },
            { label: 'Glow Overlay', grad: 'var(--grad-glow)', bg: pal.navy },
            { label: 'CTA Button',   grad: 'var(--grad-cta)',  bg: '' },
          ].map(g => (
            <div key={g.label} style={{ borderRadius: 'var(--p-radius-lg)', overflow: 'hidden', border: 'var(--border-light)' }}>
              <div style={{ height: 80, background: g.bg || 'transparent' }}><div style={{ height: '100%', background: g.grad }} /></div>
              <div style={{ padding: '10px 16px', background: 'var(--card-bg)' }}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{g.label}</span></div>
            </div>
          ))}
        </div>

        {/* Typography */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Tipografia — {font.label}</h2>
        <div style={{ ...card, marginBottom: 48 }}>
          {([
            { label: 'Hero / H1',        size: 52,  weight: 800, text: 'Sua viagem, do seu jeito' },
            { label: 'H2 Section',       size: 40,  weight: 800, text: 'Como funciona' },
            { label: 'H3 Card Title',    size: 28,  weight: 700, text: 'Roteiro personalizado' },
            { label: 'H4 Subtitle',      size: 20,  weight: 600, text: 'De volta ao Brasil em breve' },
            { label: 'Body (16px/500)',   size: 16,  weight: 500, text: 'Desenhamos experiências de viagem com a sua cara. Da inspiração ao embarque.' },
            { label: 'Body Small (14px)', size: 14,  weight: 400, text: 'Política de privacidade · Termos de uso · Todos os direitos reservados.' },
            { label: 'Overline',         size: 11,  weight: 700, text: 'TRAVEL DESIGN', ls: '0.15em', upper: true },
          ] as {label:string;size:number;weight:number;text:string;ls?:string;upper?:boolean}[]).map(t => (
            <div key={t.label} style={{ borderBottom: 'var(--border-light)', paddingBottom: 20, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{t.label}</span>
              <span style={{ fontFamily: 'var(--body-font)', fontSize: t.size, fontWeight: t.weight, letterSpacing: t.ls || 'normal', textTransform: t.upper ? 'uppercase' : 'none', color: 'var(--text-primary)', lineHeight: 1.2, display: 'block' }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Botões</h2>
        <div style={{ ...card, display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48, alignItems: 'center' }}>
          <button style={{ background: 'var(--grad-cta)', color: 'white', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: 'none', fontFamily: 'var(--btn-font)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Primary CTA</button>
          <button style={{ background: 'var(--surface-dark)', color: 'var(--on-dark-1)', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--btn-font)', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>Secondary</button>
          <button style={{ background: 'transparent', color: 'var(--text-brand)', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: '2px solid var(--p-navy)', fontFamily: 'var(--btn-font)', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>Outline</button>
          <button style={{ background: 'var(--p-champagne)', color: 'white', padding: 'var(--btn-pad)', borderRadius: 'var(--btn-radius)', border: 'none', fontFamily: 'var(--btn-font)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Accent</button>
        </div>

        {/* Cards preview */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 48 }}>
          {[
            { tag: 'Cruzeiros', title: 'Norwegian Cruise Line', desc: 'Mediterrâneo — 12 noites', price: 'a partir de R$ 6.800/pax' },
            { tag: 'Europa',    title: 'Paris & Riviera Francesa', desc: 'Roteiro personalizado — 10 dias', price: 'a partir de R$ 12.400/pax' },
            { tag: 'Disney',    title: 'Walt Disney World', desc: 'Magic Kingdom + Epcot + AK', price: 'a partir de R$ 8.200/pax' },
          ].map(c => (
            <div key={c.title} style={card}>
              <div style={{ height: 100, borderRadius: 8, background: 'var(--grad-hero)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--on-dark-accent)', position: 'relative' }}>{c.tag}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 12 }}>{c.desc}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-accent)', marginBottom: 16 }}>{c.price}</p>
              <button style={{ width: '100%', background: 'var(--grad-cta)', color: 'white', padding: '10px', borderRadius: 'var(--btn-radius)', border: 'none', fontFamily: 'var(--btn-font)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Quero esse roteiro</button>
            </div>
          ))}
        </div>

        {/* CSS snippet */}
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 24, letterSpacing: '-0.02em' }}>Copiar Tokens CSS</h2>
        <div style={{ position: 'relative' }}>
          <pre style={{ background: '#0d1117', color: '#e6edf3', padding: 28, borderRadius: 'var(--p-radius-lg)', fontSize: 13, lineHeight: 1.7, overflow: 'auto', fontFamily: "'Fira Code', monospace", border: '1px solid #30363d', whiteSpace: 'pre' }}>{tokenSnippet}</pre>
          <button onClick={() => handleCopy(tokenSnippet, 'snippet')} style={{ position: 'absolute', top: 16, right: 16, background: copied === 'snippet' ? 'var(--p-champagne)' : 'rgba(255,255,255,0.08)', color: copied === 'snippet' ? 'white' : '#e6edf3', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{copied === 'snippet' ? '✓ Copiado!' : 'Copiar'}</button>
        </div>

      </div>

      <footer style={{ padding: '24px 32px', textAlign: 'center', borderTop: 'var(--border-light)', marginTop: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>VivAir Design System v2.1 — <a href="https://github.com/m7kx/vivair-website" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-accent)', textDecoration: 'none' }}>github.com/m7kx/vivair-website</a></p>
      </footer>
    </div>
  )
}
