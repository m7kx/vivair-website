# repo-context.md — vivair-website
<!-- Arquivo de contexto on-demand para IA. Leia ao iniciar sessao neste repo. -->
<!-- Padrao WF Tier 2. Nao substitui README.md. -->

## O que e este repo

`m7kx/vivair-website` e o **site publico da VivAir** — produto/marca de viagens.
Repo ativo com PRs em andamento (#3 e #4 — status incerto, verificar antes de trabalhar).

## Stack

- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS + PostCSS
- **Deploy**: Vercel (vercel.json na raiz)
- **Linting**: ESLint (.eslintrc.json)
- **Code Review**: CodeRabbit (.coderabbit.yaml)

## Estrutura da raiz

```
vivair-website/
|-- src/          -> codigo fonte Next.js
|-- public/       -> assets estaticos
|-- .github/      -> workflows CI
|-- next.config.ts
|-- tailwind.config (via postcss)
|-- vercel.json
|-- README.md
```

## Status atual

- PRs #3 e #4: status incerto — verificar se foram mergeados antes de criar novos PRs
- Branch default: `main`
- Deploy: Vercel (automatico em push para main)
- Monitoramento: pausado (aguarda confirmacao dos PRs)

## Regras de operacao

- Verificar PRs abertos antes de qualquer trabalho: `gh pr list`
- UI/UX e frontend: usar Gemini 3.1 como executor primario
- Commits: `feat:` / `fix:` / `style:` / `docs:`
- Nao commitar diretamente em main sem review
- Nao referenciar `surething-directives.md` aqui

## Decisao pendente (STATUS.md/wf)

- D-VIVAIR-PRS: PRs #3 e #4 foram mergeados? Verificar antes de reativar monitores.

---
*Last updated: 2026-03-08 | #st-generated*
