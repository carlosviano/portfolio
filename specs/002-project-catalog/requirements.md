---
type: spec-requirements
feature: 002-project-catalog
status: in-progress
updated: 2026-10-30
---
# Project catalog — requirements

## Context
Second feature, branched from `main` after 001 foundation was merged. It adds the typed content
that every card (and later every case page) comes from, and turns the placeholder `/work` page
into the catalog. Copy is placeholder; real case content is 005.

> 2026-10-30, after the first implementation: `/work` is grouped by employer instead of a flat
> grid with a kind filter. Recruiters read experience by employer and role; a flat list of work
> cases from one job read as one job split into pieces. Employers are now content (R5), the
> card set changed (R2) and the kind filter was removed (R4).

## Requirements
### R1 — Project content schema
**Story:** As the developer, I want every project to be a validated content entry, so that cards
and case pages can't drift from one source of truth.
- R1.1 THE SYSTEM SHALL define a `projects` content collection of MDX entries validated by a Zod
  schema with: title, kind, summary, role, stack, metrics, featured, order, and employer for work
  projects.
- R1.2 THE SYSTEM SHALL restrict `kind` to `work`, `personal` or `freelance`.
- R1.3 THE SYSTEM SHALL allow at most 3 metrics per entry, each a label and a value.
- R1.4 IF an entry is missing a required field or breaks a rule in R1.2–R1.3 or R1.6 THEN THE
  SYSTEM SHALL fail the build with an error naming the entry.
- R1.5 THE SYSTEM SHALL use each entry's file name as its URL slug, and `order` values SHALL be
  unique across entries.
- R1.6 A `work` project SHALL reference an existing employer entry; `personal` and `freelance`
  projects SHALL NOT reference one.

### R2 — Placeholder entries
**Story:** As the developer, I want the real card set in place with placeholder copy, so that
layout is built against the final shape of the catalog.
- R2.1 THE SYSTEM SHALL include 8 project entries: 5 `work` at Avarda Bank (design system with two
  brand variants, customer migration flow, cash-to-account with SCA, persisted-session login
  fix, shared component library and micro-frontends), 2 `personal` (Pizca, This site) and 1
  `freelance` (cake-shop landing).
- R2.2 Exactly 3 entries SHALL be featured: design system, migration flow and Pizca.
- R2.3 Placeholder copy SHALL follow the content rules: generic product names, no internal
  product, client or brand names, and work metrics limited to scope numbers.
- R2.4 Work that isn't a full case (e.g. the notification refactor, device pairing and
  biometrics, the CMS roll-out) SHALL appear as one-line highlights of its employer (R5.2),
  not as cards.

### R3 — Work page
**Story:** As a recruiter, I want to see where I worked, in what role, and the projects behind
each role, so that I can pick the one or two cases worth opening.
- R3.1 THE SYSTEM SHALL render `/work` as sections in this order: one per employer, most recent
  first; then Personal; then Freelance.
- R3.2 Each employer section SHALL show the employer name, each role with its dates (most
  recent first, "Present" for a current role), a one-line context, its project cards and its
  highlights.
- R3.3 Within a section, cards SHALL be sorted by `order`. Each card SHALL show its number
  (01, 02, … continuous across the page), title, summary, stack and metrics, all from the entry.
- R3.4 Each card SHALL link to `/work/<slug>` with one accessible link per card (the case page
  itself is built in 003).
- R3.5 An employer with no project cards SHALL still show its header and highlights.
- R3.6 WHEN the viewport is 375 px wide THE SYSTEM SHALL show the page without horizontal
  scrolling.
- R3.7 THE SYSTEM SHALL render `/work` as static HTML with no JavaScript of its own; only the
  site-wide layout script (the email link) runs (principle 2).
- R3.8 Sections SHALL be headings in the document outline (employer and section names as
  headings, cards one level below), so screen-reader users can jump between them.

### R4 — Kind filter
- R4.1–R4.7 Removed on 2026-10-30: the sections in R3 group the page by context, so a kind
  filter is no longer needed and `/work` ships no JavaScript.

### R5 — Employers
**Story:** As the developer, I want each employer to be one content entry, so that a role or a
date changes in one place.
- R5.1 THE SYSTEM SHALL define an `employers` content collection validated by a Zod schema with:
  name, optional former name (shown as "formerly …" after a rebrand), context (one line), roles
  (title, start month, optional end month; at least one) and highlights (one-line strings).
- R5.2 Highlights SHALL be plain one-liners following the content rules (no internal figures
  or names; qualitative public outcomes such as store-review impact are allowed).
- R5.3 THE SYSTEM SHALL include 2 employers: Avarda Bank, formerly TF Bank (React Native Engineer,
  Sept 2025–present; React Developer, Apr 2024–Sept 2025) and DecoDy Software (Junior Software Developer,
  Mar 2023–Mar 2024), with placeholder context and highlights.
- R5.4 IF an employer has two roles whose dates overlap or a role whose end is before its start
  THEN THE SYSTEM SHALL fail the build naming the employer.

## Out of scope
- Case pages `/work/[slug]`, media (video loop, poster, diagrams) and the next-project link (003).
- Home featured section (004); the featured flag is only stored here.
- Real case copy, employer context and highlights, and the confidentiality pass (005).
- Locations, employment type and company logos.
