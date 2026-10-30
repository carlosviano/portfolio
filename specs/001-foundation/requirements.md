---
type: spec-requirements
feature: 001-foundation
status: done
updated: 2026-10-30
---
# Foundation — requirements

## Context
First feature of a greenfield repo (branch `main`, no commits yet). It sets up the project, the
quality bar from the constitution, the visual foundation (tokens, one light theme) and the shared
layout every later page uses. No real content yet; pages are placeholders.

## Requirements
### R1 — Project scaffold and quality bar
**Story:** As the developer, I want a working project with every quality check wired up, so that
each later feature starts from a green baseline.
- R1.1 THE SYSTEM SHALL be an Astro project with static output, React integration, Tailwind 4,
  MDX and TypeScript in strict mode, managed with pnpm and pinned to the Node version in `.nvmrc`.
- R1.2 THE SYSTEM SHALL provide the scripts named in the constitution's quality bar
  (`astro check`, `lint`, `format:check`, `test`, `test:e2e`, `build`), and each SHALL pass on
  the scaffold.
- R1.3 THE SYSTEM SHALL include at least one Vitest test and one Playwright test with an axe
  scan, so both runners are proven to work.
- R1.4 THE SYSTEM SHALL ignore build output, dependencies, local env files and test reports in git.

### R2 — Design tokens
**Story:** As a visitor, I want a calm, readable site, so that it is comfortable to scan.
- R2.1 THE SYSTEM SHALL define colour, typography, spacing and radius tokens as CSS variables
  consumed by Tailwind, with an Inditex-like minimal palette (off-white / near-black) and one
  accent token (placeholder value until the accent is chosen).
- R2.2–R2.5 Removed on 2026-10-30: one light theme only; no theme switching or OS dark mode
  (not relevant to the site's purpose).
- R2.6 THE SYSTEM SHALL meet WCAG AA contrast for text and focus indicators.

### R3 — Base layout
**Story:** As a recruiter, I want the same clear header and footer on every page, so that I can
always reach the work, the CV and the contact links.
- R3.1 THE SYSTEM SHALL provide one base layout with a header (name/wordmark linking home; nav:
  Work · About · CV) and a footer (email, LinkedIn, GitHub, CV link).
- R3.2 THE SYSTEM SHALL read the nav items, contact links and CV path from one typed site config
  file, not from component markup.
- R3.3 THE SYSTEM SHALL include a skip link to the main content as the first focusable element.
- R3.4 THE SYSTEM SHALL render the email so it is not present as plain text in the HTML source,
  while still opening the mail client when activated.
- R3.5 WHEN the viewport is 375 px wide THE SYSTEM SHALL show the header, nav and footer
  without horizontal scrolling.
- R3.6 THE SYSTEM SHALL set per-page title, description, language and canonical metadata
  through the layout.

### R4 — Routing ready for a second language
- R4.1 THE SYSTEM SHALL configure i18n with English as the default, unprefixed locale, so that
  `/es` can be added later without changing existing English URLs.

### R5 — Placeholder pages
- R5.1 THE SYSTEM SHALL provide placeholder Home and Work pages and a 404 page using the base
  layout, so that navigation and end-to-end tests have real targets.

## Out of scope
- Project content collection, catalog and filter (002), case pages and video component (003),
  real Home content (004), copy (005), analytics and deploy (006).
- Choosing the final accent colour and domain (open questions in the constitution).
