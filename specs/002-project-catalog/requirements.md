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
into the catalog of 9 projects with a kind filter. Copy is placeholder; real case content is 005.

## Requirements
### R1 — Project content schema
**Story:** As the developer, I want every project to be a validated content entry, so that cards
and case pages can't drift from one source of truth.
- R1.1 THE SYSTEM SHALL define a `projects` content collection of MDX entries validated by a Zod
  schema with: title, kind, summary, role, stack, metrics, featured, order.
- R1.2 THE SYSTEM SHALL restrict `kind` to `work`, `personal` or `freelance`.
- R1.3 THE SYSTEM SHALL allow at most 3 metrics per entry, each a label and a value.
- R1.4 IF an entry is missing a required field or breaks a rule in R1.2–R1.3 THEN THE SYSTEM
  SHALL fail the build with an error naming the entry.
- R1.5 THE SYSTEM SHALL use each entry's file name as its URL slug, and `order` values SHALL be
  unique across entries.

### R2 — Placeholder entries
**Story:** As the developer, I want the real card set in place with placeholder copy, so that
layout and filtering are built against the final shape of the catalog.
- R2.1 THE SYSTEM SHALL include 9 entries: 6 `work` (design system with brand variants, customer
  migration flow, cash-to-account with SCA, identity-login fix, shared component library and
  micro-frontends, notification refactor), 2 `personal` (Pizca, This site) and 1 `freelance`
  (cake-shop landing).
- R2.2 Exactly 3 entries SHALL be featured: design system, migration flow and Pizca.
- R2.3 Placeholder copy SHALL follow the content rules: generic product names, no employer,
  client or internal names, and work metrics limited to scope numbers.

### R3 — Work grid
**Story:** As a recruiter, I want to scan every project on one page, so that I can pick the one
or two worth opening.
- R3.1 THE SYSTEM SHALL render all entries on `/work` as a numbered list of cards sorted by
  `order`, with the number shown on each card (01, 02, …).
- R3.2 Each card SHALL show title, kind, summary, stack and its metrics, all from the entry.
- R3.3 Each card SHALL link to `/work/<slug>` with one accessible link per card (the case page
  itself is built in 003).
- R3.4 WHEN the viewport is 375 px wide THE SYSTEM SHALL show the grid without horizontal
  scrolling.
- R3.5 THE SYSTEM SHALL render the full grid as static HTML, so every card is visible without JS.

### R4 — Kind filter
**Story:** As a recruiter, I want to narrow the list to work or personal projects, so that I see
the kind I care about first, and can share the filtered link.
- R4.1 THE SYSTEM SHALL offer the filter options All, Work, Personal and Freelance.
- R4.2 WHEN a filter option is chosen THE SYSTEM SHALL show only the matching cards and update
  the URL to `?kind=<kind>` (or no parameter for All) without a page reload.
- R4.3 WHEN `/work` is loaded with a valid `?kind=` THE SYSTEM SHALL show that filter selected
  and only the matching cards.
- R4.4 IF `?kind=` is missing or not a valid kind THEN THE SYSTEM SHALL show all cards with All
  selected.
- R4.5 THE SYSTEM SHALL make the filter usable by keyboard, expose the selected option to
  assistive technology, mark it in text or shape (not colour only), and announce the number of
  shown projects when the filter changes.
- R4.6 WHILE JavaScript is unavailable THE SYSTEM SHALL show all cards and no filter controls
  that do nothing.
- R4.7 The filter SHALL be the only client-side JavaScript on `/work` (principle 2).

## Out of scope
- Case pages `/work/[slug]`, media (video loop, poster, diagrams) and the next-project link (003).
- Home featured section (004); featured flag is only stored here.
- Real case copy and the confidentiality pass (005).
