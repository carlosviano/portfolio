---
type: spec-design
feature: 001-foundation
status: done
updated: 2026-10-30
---
# Foundation — design

## Approach
Scaffold a minimal Astro project (static output) and add React, MDX and Tailwind 4 through the
Vite plugin, mirroring the conventions of my other Astro site (`.nvmrc`, Prettier plugins,
`astro check`). (R1)
Design tokens are CSS variables on `:root` (one light theme), mapped to Tailwind utilities. (R2)
One `BaseLayout` composes skip link, header, `<main id="main">` and footer; all links come from a
typed site config. (R3) i18n is configured with `en` as the unprefixed default. (R4)

## Affected areas
| File / module | Change | Reqs |
|---|---|---|
| `package.json`, `pnpm-lock.yaml`, `.nvmrc` (24.19.0), `.gitignore` | new | R1.1, R1.4 |
| `astro.config.mjs` | new: static output, react, mdx, tailwind vite plugin, i18n, placeholder `site` until the domain is chosen | R1.1, R4.1 |
| `tsconfig.json` | new: `astro/tsconfigs/strictest` | R1.1 |
| `eslint.config.js`, `.prettierrc.json`, `.prettierignore` | new | R1.2 |
| `vitest.config.ts`, `playwright.config.ts` | new; Playwright runs against `astro preview` of the build | R1.2, R1.3 |
| `src/styles/global.css` | new: tokens (colour, type scale, spacing, radius, accent placeholder), Tailwind `@theme` mapping | R2.1, R2.6 |
| `src/config/site.ts` | new: typed config (name, role, nav, email split into user + domain, LinkedIn, GitHub, CV path) | R3.2 |
| `src/layouts/BaseLayout.astro` | new: head metadata (title, description, lang, canonical), slots | R3.1, R3.6 |
| `src/components/{SkipLink,Header,Footer,EmailLink}.astro` | new | R3.1, R3.3–R3.5 |
| `src/pages/index.astro`, `src/pages/work/index.astro`, `src/pages/404.astro` | new placeholders | R5.1 |
| `src/config/site.test.ts` | new: Vitest | R1.3, R3.2 |
| `e2e/foundation.spec.ts` | new: Playwright + axe | R1.3, R2.6, R3.3–R3.5, R5.1 |

## Data and contracts
- `SiteConfig` type: `name`, `role`, `nav: { label, href }[]`, `email: { user, domain }`,
  `links: { linkedin, github }`, `cvPath`. Real handles are filled in by Carlos; placeholders until then.
- `BaseLayout` props: `title`, `description`, optional `canonicalPath`.

## Edge cases and errors
- JavaScript disabled → email shows as "user [at] domain" text (R3.4).
- Long name/nav at 375 px → nav wraps under the wordmark; no fixed widths (R3.5).

## Testing
- Vitest: site config shape (nav non-empty, email parts present, CV path starts with `/`).
- Playwright (Chromium, built site):
  - first Tab focuses the skip link and it moves focus to `main` (R3.3)
  - email `href` absent from the raw HTML but correct after hydration of the script (R3.4)
  - at 375 px, `scrollWidth <= clientWidth` on every placeholder page (R3.5)
  - axe scan with zero violations, including colour contrast (R2.6)
  - unknown URL renders the 404 page (R5.1)

## New dependencies
`astro`, `@astrojs/react`, `react`, `react-dom`, `@astrojs/mdx`, `@astrojs/check`, `typescript`,
`tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/inter` (self-hosted variable sans, no
third-party font request), `eslint`, `typescript-eslint`, `eslint-plugin-astro`,
`eslint-plugin-jsx-a11y`, `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`,
`vitest`, `@testing-library/react`, `jsdom`, `@playwright/test`, `@axe-core/playwright`.
Added during implementation: `@eslint/js` and `globals` (flat-config helpers), `@types/node`,
`@types/react`, `@types/react-dom`.

## Implementation notes
- TypeScript is pinned to 6.x: `astro check` does not support TypeScript 7 yet.
- `EmailLink` renders a `<span>` with "user [at] domain" and the script replaces it with an `<a>`,
  because an `<a>` without `href` (no-JS case) is not a valid link (jsx-a11y `anchor-is-valid`).
- Playwright's web server runs the Astro binary via `exec` with agent env variables unset:
  Astro daemonises `astro preview` under AI agents, and `pnpm exec` doesn't forward the stop
  signal. Port 4391, never reused (another local project had the default preview port).

## Alternatives rejected
- A starter template (Astro themes, Starlight) — opinionated structure and copy to strip out;
  the repo is meant to show my own decisions.
- Google Fonts — third-party request and privacy notice; self-hosting is free.
- Light/dark themes with a toggle — built, then removed on 2026-10-30: not relevant to the site's purpose.
