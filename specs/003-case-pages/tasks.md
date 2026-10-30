---
type: spec-tasks
feature: 003-case-pages
status: in-progress
updated: 2026-10-30
---
# Case pages — tasks

Tick each task as soon as it is done. If the plan changes, update design.md first.

- [ ] 1. Project schema: case fields, length rules, https links, work-has-no-video refine;
  tests — `src/content/project-schema.ts`, `src/content/project-schema.test.ts` (R1) · check:
  `pnpm test` passes
- [ ] 2. Placeholder case fields on all 8 entries, repo link on `this-site`, placeholder
  diagram on `design-system` — `src/content/projects/*.mdx`,
  `public/media/design-system/diagram.svg` (R6) · check: `pnpm run check` passes; a grep finds
  no internal product or client names
- [ ] 3. `toCasePages` and `checkMedia` with injected `stat`; tests — `src/lib/case-pages.ts`,
  `src/lib/case-pages.test.ts` (R2.1, R3.5, R3.6, R5) · check: `pnpm test` passes
- [ ] 4. `CaseHeader`, `CaseDiagram`, `NextProject` and `CaseVideo` (inline motion script);
  container API tests — `src/components/` (R2.2, R2.3, R3.1–R3.4, R4, R5) · check: `pnpm test`
  and `pnpm lint` pass
- [ ] 5. `/work/[slug].astro` with `getStaticPaths`, `checkMedia` and the section order —
  `src/pages/work/[slug].astro` (R2) · check: `pnpm build` produces 8 case pages; none has a
  module script
- [ ] 6. E2E: card links resolve, section order, step and outcome counts, next-project chain,
  diagram, no page JS, 375 px, axe on every case — `e2e/case-pages.spec.ts` (R2, R4, R5) ·
  check: `pnpm test:e2e` passes
- [ ] 7. Constitution: close the video format/size open question (R3.6) —
  `specs/constitution.md` · check: the open question is removed and the budget is in Content
  rules
- [ ] 8. Full quality bar (check, lint, format:check, test, test:e2e, build); set
  `status: done` on the three spec files · check: all green
