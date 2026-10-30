---
type: spec-tasks
feature: 002-project-catalog
status: in-progress
updated: 2026-10-30
---
# Project catalog — tasks

Tick each task as soon as it is done. If the plan changes, update design.md first.

> 2026-10-30: reworked after the requirements change (grouped by employer, no kind filter).
> First version, all done and uncommitted: project schema, `projects` collection, 9 entries,
> `toCatalog`, `ProjectCard`, `ProjectCatalog` island, `/work` wiring, e2e. The tasks below
> rework that code; the specs commit `175b785` holds the first version of the specs.

- [ ] 1. Employer schema with role-date refine; unit tests — `src/content/employer-schema.ts`,
  `src/content/employer-schema.test.ts` (R5.1, R5.4) · check: `pnpm test` passes
- [ ] 2. Project schema: optional `employer` with the work-only refine; tests —
  `src/content/project-schema.ts`, `src/content/project-schema.test.ts` (R1.1, R1.6) · check:
  `pnpm test` passes
- [ ] 3. `employers` collection and the 2 employer entries (real names, roles, dates; placeholder
  context and highlights) — `src/content.config.ts`, `src/content/employers/*.yaml` (R5.2,
  R5.3) · check: `pnpm astro check` passes
- [ ] 4. Projects to 8 entries: add `employer: avarda`, rename `identity-login-fix` →
  `session-login-fix`, delete `notification-refactor`, renumber `order` —
  `src/content/projects/*.mdx` (R2) · check: a grep finds no internal product or client names
- [ ] 5. `toCatalog` → `toWorkPage` + `formatRole`, including the empty-collection error; tests —
  `src/lib/catalog.ts`, `src/lib/catalog.test.ts` (R1.5, R1.6, R2.2, R3.1–R3.5) · check:
  `pnpm test` passes
- [ ] 6. `ProjectCard`: `h3` title, no kind label; Testing Library test; delete
  `ProjectCatalog.tsx` and its test — `src/components/` (R3.3, R3.4, R3.8, R4) · check:
  `pnpm test` and `pnpm lint` pass
- [ ] 7. `EmployerSection.astro`, `CardGrid.astro` and the `/work` page with no client directive
  — `src/components/`, `src/pages/work/index.astro` (R3.1–R3.8) · check: `pnpm build` passes;
  the built `/work` HTML has 8 card links and no `astro-island`
- [ ] 8. Rewrite e2e for sections: `h2` order, numbering 01–08, one link per card, DecoDy with
  highlights only, no page JS, 375 px, axe — `e2e/catalog.spec.ts` (R3) · check:
  `pnpm test:e2e` passes
- [ ] 9. Full quality bar (check, lint, format:check, test, test:e2e, build); set
  `status: done` on the three spec files · check: all green
