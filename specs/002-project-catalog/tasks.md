---
type: spec-tasks
feature: 002-project-catalog
status: in-progress
updated: 2026-10-30
---
# Project catalog — tasks

Tick each task as soon as it is done. If the plan changes, update design.md first.

- [x] 1. Commit the 002 specs on `feat/002-project-catalog` (specs first, per the roadmap);
  only when Carlos asks — `specs/002-project-catalog/*` · check: `pnpm format:check` passes
- [ ] 2. Project schema: `projectKinds`, `kindLabels`, `projectSchema`, `Project` type, with
  unit tests — `src/content/project-schema.ts`, `src/content/project-schema.test.ts`
  (R1.1–R1.3) · check: `pnpm test` passes
- [ ] 3. `projects` collection with the glob loader and the schema —
  `src/content.config.ts` (R1.1, R1.4, R1.5) · check: `pnpm astro check` passes; a temporary
  bad entry fails `pnpm build` with its file name (then removed)
- [ ] 4. 9 placeholder entries in the agreed order, featured 3, generic names, metrics only
  where already decided — `src/content/projects/*.mdx` (R2.1–R2.3) · check: `pnpm build`
  passes; grep for employer/client names returns nothing
- [ ] 5. Catalog helper: sort, zero-padded numbers, unique `order` and featured-3 checks, card
  props; unit tests — `src/lib/catalog.ts`, `src/lib/catalog.test.ts` (R1.5, R2.2, R3.1–R3.3)
  · check: `pnpm test` passes
- [ ] 6. `ProjectCard` component — `src/components/ProjectCard.tsx` (R3.2, R3.3) · check:
  `pnpm lint` passes (jsx-a11y)
- [ ] 7. `ProjectCatalog` island: filter group (after mount), `?kind=` read/write with
  `replaceState`, live status, `<ol>` grid; Testing Library tests —
  `src/components/ProjectCatalog.tsx`, `src/components/ProjectCatalog.test.tsx` (R3.1, R3.4,
  R4.1–R4.6) · check: `pnpm test` passes
- [ ] 8. Wire `/work`: `getCollection` → `toCatalog` → `<ProjectCatalog client:load>` —
  `src/pages/work/index.astro` (R3, R4.7) · check: `pnpm build` passes; the built `/work` HTML
  contains all 9 cards
- [ ] 9. End-to-end tests: no-JS list, `?kind=` valid/invalid, keyboard filter + URL, one link
  per card, numbering, 375 px, axe with a filter applied, one island —
  `e2e/catalog.spec.ts` (R3.1–R3.5, R4.2–R4.7) · check: `pnpm test:e2e` passes
- [ ] 10. Full quality bar (check, lint, format:check, test, test:e2e, build); set
  `status: done` on the three spec files · check: all green
