---
type: spec-tasks
feature: 001-foundation
status: done
updated: 2026-10-30
---
# Foundation — tasks

Tick each task as soon as it is done. If the plan changes, update design.md first.

> 2026-10-30: the theme parts of tasks 4, 6, 7 and 9 (dark tokens, init script, toggle, theme
> tests) were removed afterwards. One light theme only; see requirements R2.

- [x] 1. Scaffold minimal Astro project with pnpm; add `.nvmrc`, `.gitignore`, `tsconfig.json`
  (strictest), React + MDX integrations, Tailwind via Vite plugin, static output, i18n (`en`
  unprefixed), placeholder `site` — `package.json`, `astro.config.mjs` (R1.1, R1.4, R4.1) ·
  check: `pnpm build` and `pnpm astro check` pass
- [x] 2. ESLint flat config + Prettier with plugins; scripts `lint`, `format`, `format:check` —
  `eslint.config.js`, `.prettierrc.json`, `.prettierignore` (R1.2) · check: `pnpm lint` and
  `pnpm format:check` pass
- [x] 3. Vitest + Playwright setup with axe; scripts `test`, `test:e2e`; Playwright serves the
  build with `astro preview` — `vitest.config.ts`, `playwright.config.ts` (R1.2, R1.3) · check:
  a smoke test passes in each runner
- [x] 4. Tokens and themes: colour, type scale, spacing, radius, accent placeholder, light/dark
  and OS fallback; self-hosted Inter — `src/styles/global.css` (R2.1, R2.2, R2.6) · check: a
  placeholder page renders both themes via devtools emulation
- [x] 5. Typed site config + Vitest test — `src/config/site.ts`, `src/config/site.test.ts`
  (R3.2) · check: `pnpm test` passes
- [x] 6. `BaseLayout` with metadata props and the theme init script; `SkipLink` —
  `src/layouts/BaseLayout.astro`, `src/components/SkipLink.astro` (R2.5, R3.3, R3.6) · check: no
  theme flash on hard reload with dark stored; first Tab shows skip link
- [x] 7. `Header`, `Footer`, `ThemeToggle` (persisted, storage-safe), `EmailLink` (assembled by
  script, text fallback without JS) — `src/components/*.astro` (R2.3, R2.4, R3.1, R3.4, R3.5) ·
  check: manual run at 375 px and with JS disabled
- [x] 8. Placeholder Home, Work and 404 pages using the layout — `src/pages/index.astro`,
  `src/pages/work/index.astro`, `src/pages/404.astro` (R5.1) · check: `pnpm build` emits all three
- [x] 9. End-to-end tests for skip link, theme (toggle, persistence, OS default), email, 375 px
  overflow, axe in both themes, 404 — `e2e/foundation.spec.ts` (R2.2–R2.6, R3.3–R3.5, R5.1) ·
  check: `pnpm test:e2e` passes
- [x] 10. Quality bar from the constitution passes: `astro check`, `lint`, `format:check`,
  `test`, `test:e2e`, `build` · check: all six green in one run
