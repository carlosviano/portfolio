---
type: spec-requirements
feature: 003-case-pages
status: done
updated: 2026-10-30
---
# Case pages — requirements

## Context
Third feature, branched from `main` (`feat/003-case-pages`) after 002 project-catalog was merged
(PR #3). Every `/work` card links to `/work/<slug>/`, which 404s until this feature builds the
case page. The template follows the constitution's content rules; copy stays placeholder until
005 case-content.

Written directly from roadmap row 003 instead of the `/sdd` gates, with one review of all three
files (agreed on 2026-10-30).

## Requirements
### R1 — Case content schema
**Story:** As the developer, I want the case template to be validated fields, so that every case
page has the same shape and a missing section fails the build.
- R1.1 THE SYSTEM SHALL extend the `projects` schema with: context (one line), links (label and
  URL, default none), problem, steps, outcomes, differently (what I'd do differently), and
  optional media (video, diagram).
- R1.2 THE SYSTEM SHALL require exactly 4 steps and exactly 3 outcomes.
- R1.3 THE SYSTEM SHALL limit context and differently to 160 characters and problem to 320
  characters (1–2 sentences).
- R1.4 IF an entry is missing a case field or breaks R1.2–R1.3, R1.5 or R1.6 THEN THE SYSTEM
  SHALL fail the build with an error naming the entry.
- R1.5 A `work` project SHALL NOT have a video (constitution principle 4: no screenshots of
  employer work); a diagram is allowed for every kind.
- R1.6 Every link SHALL be an absolute `https://` URL.

### R2 — Case page
**Story:** As a recruiter, I want each case to read the same way, so that I can scan role,
problem and outcome in under a minute.
- R2.1 THE SYSTEM SHALL build one static page per project entry at `/work/<slug>/`.
- R2.2 Each page SHALL show, in this order: title; header fields Role · Context · Stack · Links;
  Problem; What I did (4 numbered steps); Outcome (3 bullets); What I'd do differently; media
  (when the entry has any); Next project.
- R2.3 WHEN an entry has no links THE SYSTEM SHALL omit the Links field rather than show it empty.
- R2.4 The page title SHALL be the project title and its meta description the card summary.
- R2.5 Sections SHALL be headings in the document outline (title `h1`, sections `h2`).
- R2.6 WHEN the viewport is 375 px wide THE SYSTEM SHALL show the page without horizontal
  scrolling.
- R2.7 A page without a video SHALL ship no JavaScript of its own; only the site-wide layout
  script runs (principle 2).

### R3 — Video loop
**Story:** As a recruiter, I want to see a personal project working, without it distracting me
or ignoring my motion settings.
- R3.1 WHEN an entry has a video THE SYSTEM SHALL show it muted, looping and inline, with its
  poster image shown until it plays.
- R3.2 WHEN the visitor does not prefer reduced motion THE SYSTEM SHALL start the loop
  automatically; WHEN they prefer reduced motion THE SYSTEM SHALL show the poster and start the
  video only on request.
- R3.3 THE SYSTEM SHALL let the visitor pause and resume the video with the keyboard (WCAG 2.2.2).
- R3.4 Every video SHALL have a text description of what it shows, available to screen readers.
- R3.5 IF a video, poster or diagram file is missing, or a video or poster is over the media
  budget, THEN THE SYSTEM SHALL fail the build naming the entry and the file.
- R3.6 Media budget: video MP4 (H.264), at most 2 MB and 20 s, at most 1280 px wide; poster
  WebP or JPEG, at most 200 KB. This settles the constitution's open question on video format
  and size.

### R4 — Diagram slot
**Story:** As a technical interviewer, I want an architecture diagram where one helps, so that
I can see how the parts fit without reading code.
- R4.1 WHEN an entry has a diagram THE SYSTEM SHALL show it as an image in a figure with its
  alt text and optional caption.
- R4.2 The diagram's alt text SHALL be required and SHALL describe the structure the diagram
  shows.

### R5 — Next project
**Story:** As a recruiter, I want to move on to the next case without going back to `/work`.
- R5.1 Each page SHALL end with a link to the next project in `/work` display order (the card
  numbers 01–08), showing its number and title.
- R5.2 The last project SHALL link to the first.

### R6 — Placeholder case content
**Story:** As the developer, I want every entry to have placeholder case fields, so that the
template is built against the final shape.
- R6.1 All 8 entries SHALL have placeholder context, problem, 4 steps, 3 outcomes and
  differently, marked "Placeholder:", following the content rules.
- R6.2 "This site" SHALL link to its public GitHub repo; other entries SHALL have no links
  until 005.
- R6.3 The design-system entry SHALL have a placeholder diagram (a generic SVG of boxes, no
  internal names), so the diagram slot is exercised on a real page.

## Out of scope
- Real case copy, real media and the confidentiality pass (005).
- A real video loop: no entry ships a video in 003 (see Open questions).
- Home featured section (004); `/es` pages.
- Screenshots or galleries beyond one video and one diagram per case.

## Open questions
- A placeholder video needs `ffmpeg` (not installed) or a short real recording. Without one,
  R3 is tested with Vitest through the Astro container API, and the end-to-end video test
  arrives with the first real loop in 005.
