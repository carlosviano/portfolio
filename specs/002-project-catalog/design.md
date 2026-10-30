---
type: spec-design
feature: 002-project-catalog
status: in-progress
updated: 2026-10-30
---
# Project catalog — design

## Approach
Projects are an Astro content collection (`glob` loader over `src/content/projects/*.mdx`). The
Zod schema lives in a plain module so Vitest can test it without Astro's virtual modules. (R1)
Rules that span entries (unique `order`, 3 featured) are checked by a small catalog helper the
`/work` page calls at build time, so a broken catalog fails `pnpm build`. (R1.5, R2.2)
The page renders one React island, `ProjectCatalog`, with `client:load`. Astro renders its HTML
at build time, so every card is in the static HTML (R3.5). After hydration the island reads
`?kind=`, filters the list and shows the filter controls (R4). Cards are a React component, so
004 can render the featured ones on Home with no client directive and no JS.

## Affected areas
| File / module | Change | Reqs |
|---|---|---|
| `src/content/project-schema.ts` | new: `projectKinds`, `kindLabels`, `projectSchema` (Zod from `astro/zod`), `Project` type | R1.1–R1.3 |
| `src/content.config.ts` | new: `projects` collection, glob loader, `projectSchema` | R1.1, R1.4, R1.5 |
| `src/content/projects/*.mdx` | new: 9 placeholder entries (file name = slug) | R2.1–R2.3 |
| `src/lib/catalog.ts` | new: `toCatalog(entries)` sorts by `order`, checks unique `order` and 3 featured (throws naming the clashing entries), maps entries to card props | R1.5, R2.2, R3.1–R3.3 |
| `src/components/ProjectCard.tsx` | new: number, title (the card's single link), kind, summary, stack, metrics | R3.2, R3.3 |
| `src/components/ProjectCatalog.tsx` | new island: filter group, live status, `<ol>` of cards | R3.1, R3.4, R4.1–R4.7 |
| `src/pages/work/index.astro` | replace placeholder: `getCollection` → `toCatalog` → `<ProjectCatalog client:load>` | R3, R4.7 |
| `src/content/project-schema.test.ts`, `src/lib/catalog.test.ts`, `src/components/ProjectCatalog.test.tsx` | new: Vitest (+ Testing Library) | R1–R4 |
| `e2e/catalog.spec.ts` | new: Playwright + axe | R3, R4 |

## Data and contracts
- `projectSchema` frontmatter:
  `title: string` · `kind: "work" | "personal" | "freelance"` · `summary: string` (1 sentence,
  ≤ 160 chars) · `role: string` · `stack: string[]` (≥ 1) · `metrics: { label, value }[]`
  (≤ 3, default `[]`) · `featured: boolean` (default `false`) · `order: positive int`.
  The MDX body is case-page copy for 003; it's a one-line placeholder for now.
- `CatalogItem` (island props, plain serialisable data only): `slug`, `number` ("01"…),
  `href` (`/work/<slug>/`), `title`, `kind`, `summary`, `stack`, `metrics`.
- `ProjectCatalog` props: `items: CatalogItem[]`. No copy in components besides UI labels
  (filter names come from `kindLabels`; status reads "Showing N of 9 projects").

## Behaviour
- Filter: a `role="group"` with the label "Filter by kind" and 4 buttons
  (All · Work · Personal · Freelance) using `aria-pressed`. The selected button is bold with an
  underline (shape, not just colour). (R4.1, R4.5)
- Choosing an option filters the list and calls `history.replaceState` with `?kind=<kind>`, or
  no query for All. `replaceState` means filter clicks don't pile up in the Back history. (R4.2)
- After mount, the island reads `?kind=`: a valid kind applies, anything else falls back to All.
  (R4.3, R4.4)
- The filter group renders only after mount, so the no-JS HTML has every card and no dead
  controls. (R4.6)
- A `role="status"` region announces "Showing N of 9 projects" when the filter changes. (R4.5)
- The card number comes from the card's place in the full list, so it stays the same when
  filtered. Only matching items are rendered (not hidden with CSS), so the `<ol>` count read by
  screen readers is correct.
- Grid: 1 column by default, 2 from `md`, 3 from `lg`; no fixed widths. (R3.4)

## Edge cases and errors
- Duplicate `order` or a featured count other than 3 → `toCatalog` throws with the entry slugs,
  and the build fails. (R1.5, R2.2)
- Invalid frontmatter → Astro's content error names the file, and the build fails. (R1.4)
- `?kind=Work` (wrong case) or `?kind=` (empty) → All. (R4.4)
- Kind with no entries can't happen with the current set; the status would still read
  "Showing 0 of 9 projects" rather than an empty, silent list.
- The first paint with `?kind=` shows all cards until hydration (static HTML can't read the
  query). With `client:load` this is one frame or so; accepted rather than adding an inline
  pre-hydration script.

## Placeholder content
- Order: 01 design system, 02 migration flow, 03 Pizca (the featured 3), then cash-to-account,
  identity-login fix, component library, notification refactor, cake-shop landing, this site.
- Metrics: left empty except figures already decided in the vault (design system: 2 brand
  variants). No invented numbers (principle 5); real figures come in 005.
- Generic product names only; summaries marked as placeholders in the copy itself.

## Testing
- Vitest, schema: a valid entry parses; a wrong kind, 4 metrics, or a missing title is rejected.
- Vitest, catalog: sorts by order; numbers are zero-padded; a duplicate order throws naming both
  slugs; 2 or 4 featured throws.
- Vitest + Testing Library, `ProjectCatalog`: renders all items; clicking Work leaves only work
  items, sets `aria-pressed`, updates the status text and calls `replaceState` with `?kind=work`;
  All clears the query; an initial `?kind=personal` applies; `?kind=nope` shows all.
- Playwright (built site):
  - without JS: 9 cards, no filter group (R3.5, R4.6)
  - `/work/?kind=personal` shows 2 cards with Personal pressed (R4.3); `?kind=nope` shows 9 (R4.4)
  - keyboard only: Tab to Work, press Enter → 6 cards and the URL has `?kind=work` (R4.2, R4.5)
  - each card has exactly one link to `/work/<slug>/` (R3.3); numbers 01–09 in order (R3.1)
  - 375 px, no horizontal scroll; axe has zero violations with a filter applied (R3.4, R4.5)
  - exactly one `astro-island` on `/work` (R4.7)

## New dependencies
None. Testing Library's `fireEvent` covers the island tests; Zod comes from `astro/zod`.

## Open questions
- With only 9 projects (6 / 2 / 1) the kind filter may not earn its place. Keep it for now and
  decide after 005, when the real cards are in. Dropping it would mean removing R4 and the island,
  leaving `/work` with zero JS.

## Alternatives rejected
- Filter as a vanilla `<script>` that toggles `hidden` on Astro-rendered cards: less JS, but
  it splits the grid's state between markup and a script. The React island is also the one
  piece of the public repo that shows React work.
- Hiding non-matching cards with CSS instead of removing them: list semantics would report 9
  items while showing 6.
- Filter links (`<a href="?kind=work">`) without JS: a static site can't filter on the server,
  so the link would reload the same full list.
- `pushState` per filter change: Back would step through filter clicks instead of leaving the page.
