---
type: spec-design
feature: 003-case-pages
status: in-progress
updated: 2026-10-30
---
# Case pages — design

## Approach
The case template is frontmatter, not MDX body. Zod can then enforce 4 steps, 3 outcomes and
the length limits at build time, which a free-form body can't. The MDX body is not rendered in
003. The collection keeps the MDX loader, so a later feature can add components to the body
without migrating files. (R1)
`toCasePages(projects, employers)` builds every case page model. It reuses `toWorkPage` to get
the display order, so the cross-entry checks run once and "next project" follows the card
numbers. (R2, R5)
`/work/[slug].astro` renders the model with Astro components. The video is the only part with
JS: a small inline script in `CaseVideo.astro`, not a React island. It ships only on pages with
a video. (R2.7, R3)
Media files live in `public/media/<slug>/`. `checkMedia` runs in `getStaticPaths` and fails the
build on a missing file or a file over budget. It gets `stat` injected, so Vitest can test it
without real files. (R3.5)

## Affected areas
| File / module | Change | Reqs |
|---|---|---|
| `src/content/project-schema.ts` | add `context`, `links`, `problem`, `steps`, `outcomes`, `differently`, `media`; work-has-no-video refine; update the body comment | R1 |
| `src/content/project-schema.test.ts` | new cases for R1.2, R1.3, R1.5, R1.6 | R1 |
| `src/lib/case-pages.ts` | new: `toCasePages`, `checkMedia`, `mediaBudget` | R2, R3.5, R3.6, R5 |
| `src/lib/case-pages.test.ts` | new | R2, R3.5, R5 |
| `src/pages/work/[slug].astro` | new: `getStaticPaths` from `toCasePages` + `checkMedia` | R2 |
| `src/components/CaseHeader.astro` | new: title, Role · Context · Stack · Links `dl` | R2.2, R2.3 |
| `src/components/CaseVideo.astro` | new: video, poster, description, inline motion script | R3 |
| `src/components/CaseDiagram.astro` | new: `figure` with `img`, alt, caption | R4 |
| `src/components/NextProject.astro` | new | R5 |
| `src/components/Case*.test.ts` | new: Astro container API render tests | R2.3, R3, R4 |
| `src/content/projects/*.mdx` | placeholder case fields for all 8; repo link on `this-site`; diagram on `design-system` | R6 |
| `public/media/design-system/diagram.svg` | new: generic placeholder diagram | R6.3 |
| `e2e/case-pages.spec.ts` | new | R2, R4, R5 |

## Data and contracts
- `projectSchema` additions:
  - `context: string` (≤ 160)
  - `links: { label: string, href: string (https URL) }[]` (default `[]`)
  - `problem: string` (≤ 320)
  - `steps: string[]` (length 4)
  - `outcomes: string[]` (length 3)
  - `differently: string` (≤ 160)
  - `media?: { video?: { src, poster, description }, diagram?: { src, alt, caption? } }`
  - Paths are relative to `public/` with a leading `/`, e.g. `/media/pizca/loop.mp4`.
- Refine: `kind === "work"` with `media.video` → issue on `media.video`, "Work cases can't show
  video (no screenshots of employer work)". (R1.5)
- `CasePage` = `{ slug, number, title, summary, role, context, stack, links, problem, steps,
  outcomes, differently, media?, next: { number, title, href } }`.
- `toCasePages` flattens `toWorkPage` sections in display order (employers, Personal,
  Freelance). `next` is the following item, and the last one wraps to the first. (R5)
- `mediaBudget = { videoBytes: 2_000_000, posterBytes: 200_000 }`, and the poster must be
  `.webp`, `.jpg` or `.jpeg`. `checkMedia(page, stat)` throws
  `Case "<slug>": <file> is missing` or `… is <n> KB, over the <m> KB budget`. Duration
  (≤ 20 s) and width (≤ 1280 px) can't be read without `ffprobe`. They're checked by hand when
  a loop is added in 005 and noted in the entry's PR. (R3.5, R3.6)

## Markup
- `h1` title. Header `dl`: Role, Context, Stack (inline list), Links (`ul` of external links,
  omitted when empty). (R2.2, R2.3, R2.5)
- `h2` sections: Problem (`p`), What I did (`ol`, 4 items), Outcome (`ul`, 3 items), What I'd
  do differently (`p`), Media (only when there is media), Next project.
- Video: `<video muted loop playsinline controls preload="metadata" poster>`, with no
  `autoplay` attribute. The inline script plays every `video[data-loop]` when
  `matchMedia("(prefers-reduced-motion: no-preference)")` matches. Native `controls` give a
  keyboard-operable pause and play. The `description` is the visible `figcaption`, linked to the
  video with `aria-describedby`. Without JS the poster and controls still work. (R3.1–R3.4)
- Diagram: `<figure><img src alt width height loading="lazy"><figcaption?></figure>`. (R4)
- Next project: `nav aria-label="Next project"` with one link, "03 · Cash-to-account". (R5)
- Layout: single column, `max-w-page` and the existing spacing tokens; prose at a readable
  measure (`max-w-prose`); media at full column width. (R2.6)

## Edge cases and errors
- Missing case field, wrong step or outcome count, over-length text, non-https link, or video on
  a work case → schema error naming the file. (R1.4)
- Missing media file or a file over budget → `checkMedia` throws during the build. (R3.5)
- Only one project → `next` points to itself. This can't happen with 8 entries, but there is a
  test for it.
- Cross-entry errors (duplicate order, unknown employer, featured ≠ 3) come from `toWorkPage`
  unchanged.

## Testing
- Vitest, schema: steps ≠ 4 and outcomes ≠ 3 rejected; over-length problem rejected;
  `http://` link rejected; work case with video rejected; personal case with video and work
  case with diagram accepted.
- Vitest, `toCasePages`: 8 pages in display order; `next` of 08 is 01; numbers match `/work`.
- Vitest, `checkMedia`: missing file, video over budget, poster over budget and a PNG poster
  each throw with slug and file; a valid set passes.
- Vitest + Astro container API: `CaseHeader` omits Links when empty; `CaseVideo` renders with
  no `autoplay`, has `muted loop playsinline controls poster`, links the description and
  includes the motion script; `CaseDiagram` renders alt and caption.
- Playwright (built site): every card link on `/work` opens a 200 page whose `h1` is the card
  title; `h2` order on the design-system page; 4 `ol` items and 3 outcome items; next-project
  chain visits all 8 and returns to 01; design-system shows the diagram; no page script on a
  case without video; 375 px with no horizontal scroll; axe has zero violations on every case
  page.

## New dependencies
None.

## Alternatives rejected
- Template in the MDX body with headings: no build-time check of 4 steps / 3 outcomes, and
  005's copy would drift from the template.
- Astro `image()` schema helper for the poster and diagram: needs `astro:content` in the
  schema module (untestable in Vitest, as in 002), and Astro's image pipeline doesn't handle
  video.
- A React island for the video: an inline script of a few lines does the job without React on
  the page.
- `autoplay` attribute with CSS for reduced motion: CSS can't stop autoplay, so the motion
  preference would be ignored.
