---
type: constitution
updated: 2026-10-30
---
# Constitution — portfolio

## Purpose
A personal portfolio site that recruiters receive alongside the CV for React / React Native
roles. It shows what a CV can't: in-depth case studies, visuals, and the site's own public code.

## Users
- Recruiters and hiring managers: scan the site in 1–2 minutes on mobile or desktop, open a
  case study or two, and find the contact links.
- Technical interviewers: may read the public repo as a code sample.

## Stack
- Language / runtime: TypeScript (strict), Node 24 (`.nvmrc`), pnpm.
- Framework(s): Astro (static output) + React islands only where interaction is needed;
  Tailwind 4 with design tokens as CSS variables (one light theme, no theme switching).
- Data / state: Astro content collections (MDX) validated by Zod schemas; URL params for UI
  state (e.g. `?kind=`). No backend, no database.
- Testing: Vitest + Testing Library (schemas, islands); Playwright + axe (end-to-end, a11y).
- Hosting: Cloudflare Pages, custom domain; Cloudflare Web Analytics (cookieless).

## Principles
1. Content first: every card and case page comes from a typed content entry; no copy hard-coded
   in components.
2. Static by default: ship zero JS unless an island earns it; aim for Lighthouse ≥ 95 everywhere.
3. Accessibility is a requirement: semantic HTML, skip link, keyboard paths, visible focus,
   `prefers-reduced-motion` respected, no colour-only meaning.
4. Confidentiality by design: employer work is described generically; no internal product or
   brand names, internal metrics, screenshots, URLs or code.
5. Honest claims: every outcome on the site must be one I can defend in an interview.
6. Small, reviewable changes: one feature spec at a time; the public repo is part of the portfolio.

## Quality bar (must pass before "done")
- [ ] `pnpm astro check` (inferred)
- [ ] `pnpm lint` — ESLint flat config: typescript-eslint, eslint-plugin-astro, jsx-a11y (inferred)
- [ ] `pnpm format:check` — Prettier with Astro + Tailwind plugins (inferred)
- [ ] `pnpm test` — Vitest (inferred)
- [ ] `pnpm test:e2e` — Playwright + axe against the built site (inferred)
- [ ] `pnpm build` (inferred)

## Constraints and non-goals
- No /cv page and no manifesto page; only a link to the existing CV PDF.
- No contact form, no backend, no cookies; no phone number or address anywhere.
- English only at launch; routing must allow adding `/es` later without a rewrite.
- Personal project repos stay private; they are shown with video loops and screenshots.
- Third-party client work only appears with the client's permission.
- Deploys, domain and DNS changes are manual and need explicit approval.

## Content rules
- Case page template (~250–300 words): header fields Role · Context · Stack · Links → Problem
  (1–2 sentences) → What I did (4 numbered steps) → Outcome (3 bullets) → What I'd do differently
  (1 line) → media → Next project.
- Up to 3 numbers per card. Work cases: scope numbers only (screens, brand variants, app states);
  no internal business KPIs or figures; qualitative public outcomes I can defend (e.g. store-review
  impact) are allowed. Personal projects: real, verifiable numbers (evals, tests).
- No taglines or buzzwords; one role label used everywhere; the same figure is identical wherever it appears.
- Positioning stays "React & React Native engineer"; Pizca's card leads on AI with human approval.
  A dedicated AI project is planned as feature 007, after launch.

## Roadmap
One branch and PR per feature (`feat/NNN-name`); specs commit first, then implementation.
| # | Feature | Scope |
|---|---|---|
| 001 | foundation | Scaffold, quality bar, tokens, base layout, i18n config (done) |
| 002 | project-catalog | Content collection + Zod schema, 9 placeholder entries, `/work` grid with kind filter (`?kind=`) |
| 003 | case-pages | `/work/[slug]` template (content rules above), video loop (reduced motion, poster), diagram slot, next project |
| 004 | home | Plain-role hero, numbered featured 3, About, contact links, CV link |
| 005 | case-content | The 9 case studies drafted from interview stories + CV, reviewed, confidentiality pass |
| 006 | launch | README, analytics, preview, domain and deploy (each step approved) |
| 007 | ai-project | One AI product project (after launch), then its card |

## Open questions
- Domain name (decided before feature 006 launch).
- Personal accent colour (decide in 001 or keep a placeholder token).
- Video format/size budget for the HyperFrames loops (decide in 003 case-pages).
