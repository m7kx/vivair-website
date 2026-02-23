# VivAir Travel Design — Site Oficial

**Stack**: Next.js 15 · Tailwind CSS 4 · Framer Motion · TypeScript · Vercel

> "Premium porém simples." — Viagens inesquecíveis de forma fácil e inteligente.

## Setup

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.

## Estrutura

```
src/
├── app/
│   ├── globals.css          # Design tokens (Layer 0/1/2) + Tailwind
│   ├── layout.tsx           # Root layout + fonts (DM Sans + DM Serif Display)
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # Componentes base (Button, Card, Badge...)
│   ├── sections/            # Seções da home (Hero, HowItWorks, CTA...)
│   └── layout/              # Navbar, Footer
├── lib/
│   └── utils.ts             # Utilitários (cn, clsx...)
└── styles/
    └── tokens.css           # Design tokens documentados
```

## Design System

O design system está em `src/app/globals.css` com 3 camadas de tokens CSS:

- **Layer 0**: Primitivas (cores hex, fontes, tamanhos)
- **Layer 1**: Semânticos (o que significam — `--text-brand`, `--surface-dark`)
- **Layer 2**: Componentes (`--btn-bg`, `--card-radius`, `--hero-font`)

**Trocar fonte** = mudar `--p-font-primary` (1 variável)
**Trocar paleta** = mudar as `--p-*` primitivas (6 variáveis)

## Design System Dashboard (Interactive)

Abra `/design-system` para ver o dashboard interativo com font switcher, palette switcher e radius slider ao vivo.

## Deploy

Deploy automático via Vercel a cada push em `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/m7kx/vivair-website)
