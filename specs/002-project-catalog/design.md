---
type: spec-design
feature: 002-project-catalog
status: in-progress
updated: 2026-10-30
---
# Project catalog — design

> 2026-10-30: reworked after the requirements change (grouped by employer, no kind filter).
> The first version's React island (`ProjectCatalog`) and its tests are removed.

## Approach
Two content collections: `projects` (MDX, `src/content/projects/*.mdx`) and `employers` (YAML,
`src/content/employers/*.yaml`), both with the `glob` loader. The file name is the id. The Zod
schemas live in plain modules so Vitest can test them without Astro's virtual modules. (R1, R5)
A work project names its employer by id (`employer: avarda`), validated as a plain string rather
than Astro's `reference()`. `reference()` needs `astro:content`, which would make the schema
module untestable in Vitest. `toWorkPage` checks the id exists, so the build still fails on a
typo. (R1.6)
`toWorkPage(projects, employers)` builds the whole page model: sections in order, cards sorted,
continuous numbering, and the cross-entry checks. `/work` renders it with Astro components plus
the React `ProjectCard`, rendered without a client directive, so no JS. (R3)

## Affected areas
| File / module | Change | Reqs |
|---|---|---|
| `src/content/project-schema.ts` | add optional `employer` (id) with a refine: required for `work`, absent otherwise | R1.1, R1.6 |
| `src/content/employer-schema.ts` | new: `employerSchema` (name, `formerly?`, context, roles, highlights), month format `YYYY-MM`, role-date refine | R5.1, R5.4 |
| `src/content.config.ts` | add the `employers` collection | R5.1 |
| `src/content/employers/{avarda,decody}.yaml` | new: real names, roles and dates; placeholder context and highlights | R5.2, R5.3 |
| `src/content/projects/*.mdx` | 8 entries: add `employer: avarda` to work ones, rename `identity-login-fix` → `session-login-fix`, delete `notification-refactor`, renumber `order` | R2 |
| `src/lib/catalog.ts` | `toCatalog` → `toWorkPage`; adds `formatRole` ("Sept 2025 – Present") | R1.5, R1.6, R2.2, R3.1–R3.5 |
| `src/components/ProjectCard.tsx` | card title becomes `<h3>`; kind label dropped (the section already says it) | R3.3, R3.4, R3.8 |
| `src/components/EmployerSection.astro`, `src/components/CardGrid.astro` | new | R3.2, R3.5, R3.8 |
| `src/pages/work/index.astro` | render the page model; no `client:*` directive | R3, R3.7 |
| `src/components/ProjectCatalog.tsx`, `.test.tsx` | delete | R4 |
| `src/content/employer-schema.test.ts`, `src/lib/catalog.test.ts`, `src/components/ProjectCard.test.tsx` | new / rewritten | R1, R3, R5 |
| `e2e/catalog.spec.ts` | rewrite for sections | R3 |

## Data and contracts
- `employerSchema`: `name: string` · `formerly?: string` · `context: string` (≤ 160 chars) ·
  `roles: { title, start: "YYYY-MM", end?: "YYYY-MM" }[]` (≥ 1, listed most recent first) ·
  `highlights: string[]` (default `[]`).
- Role refine (R5.4): every `end ≥ start`; roles sorted by `start` must not overlap. A role may
  start in the month the previous one ended (Sept 2025 handover).
  Month strings compare correctly as strings, so no date parsing is needed.
- `projectSchema` gains `employer?: string`; the R1.2 kinds and R1.3 metrics rules are unchanged.
- `WorkPage` = `{ employers: EmployerSection[], personal: CatalogItem[], freelance: CatalogItem[] }`;
  `EmployerSection` = `{ id, name, formerly?, context, roles: { title, dates, start, end? }[],
  highlights, items: CatalogItem[] }`; `CatalogItem` is unchanged.
- Employer order: most recent role `start` first. No `order` field, because dates already define
  it.
- Numbering runs through the page in display order (employers, then Personal, then Freelance).
  `order` sorts cards within a section and stays unique across all entries.
- `formatRole`: `Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" })` gives
  "Sept 2025", matching the CV; a missing `end` reads "Present". Wrapped in `<time datetime>`.

## Markup
- `h1` Work → `h2` per employer ("Avarda Bank", then a muted "formerly TF Bank"), "Personal",
  "Freelance" → `h3` per card title. (R3.8)
- Employer header: roles as a list of "Title · dates", then context. Cards grid (1 / 2 / 3
  columns at default / `md` / `lg`), then highlights as a `ul`. No cards → no grid. (R3.2, R3.5)
- The card is unchanged otherwise: number, title link with the stretched `::after`, summary,
  metrics `dl`, stack list.

## Edge cases and errors
- Work project with no employer, or personal/freelance with one → schema error naming the file.
  (R1.4, R1.6)
- Unknown employer id → `toWorkPage` throws naming the project and the id. (R1.6)
- Duplicate `order`, featured ≠ 3 → throws as before. Overlapping or backwards roles → schema
  error naming the employer file. (R1.5, R2.2, R5.4)
- Empty `projects` collection → `toWorkPage` throws "No project entries found; restart the dev
  server if you just added content config". This covers the stale dev-server case hit on
  2026-10-30.
- Employer with no work projects (DecoDy) → header and highlights only. (R3.5)

## Placeholder content
- Avarda Bank (`avarda.yaml`), formerly TF Bank: React Native Engineer 2025-09–present; React
  Developer 2024-04–2025-09. Placeholder highlights: notification architecture, device pairing
  and biometrics, CMS roll-out.
- DecoDy Software (`decody.yaml`): Junior Software Developer 2023-03–2024-03. Placeholder
  highlights: a browser game in React and TypeScript, internal tooling.
- Project order: 1 design system, 2 migration flow, 3 cash-to-account, 4 session-login fix,
  5 component library (Avarda); 6 Pizca, 7 this site (Personal); 8 cake-shop landing.
- Context and highlight text is marked "Placeholder:". Real copy comes in 005.

## Testing
- Vitest, employer schema: valid entry parses; bad month format, `end < start` and overlapping
  roles are rejected; a role starting the month the previous one ended is accepted.
- Vitest, project schema: `work` without employer and `personal` with employer are rejected.
- Vitest, `toWorkPage`: section order (most recent employer first, then Personal, Freelance);
  continuous numbering; unknown employer, duplicate order, featured ≠ 3 and an empty collection
  throw; an employer with no projects keeps its section.
- Vitest, `formatRole`: "Sept 2025 – Present" and "Apr 2024 – Sept 2025".
- Vitest + Testing Library, `ProjectCard`: one link to `/work/<slug>/`, title is an `h3`.
- Playwright (built site): `h2` order Avarda Bank, DecoDy Software, Personal, Freelance; cards
  01–08 in order with one link each; DecoDy shows highlights and no cards; no `astro-island` and
  no module script from the page (only the layout's email script); 375 px with no horizontal
  scroll; axe has zero violations.

## New dependencies
None.

## Alternatives rejected
- Flat grid with a kind filter (first implementation): six cases from one job read as one job
  split up, and the filter wasn't worth its JS with 9 cards.
- Employer as a field repeated on each project: role and date changes would need editing in
  several files, and employers without cards would have nowhere to live.
- Astro `reference("employers")`: needs `astro:content` in the schema module, so it can't be
  unit-tested; the id check in `toWorkPage` gives the same build-time failure.
- Two employer sections for TF Bank and Avarda Bank: it's the same company after a rebrand. One
  section with both roles shows the progression.
