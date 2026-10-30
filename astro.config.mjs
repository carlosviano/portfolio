// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Placeholder until the domain is chosen (constitution, open questions).
  // Used for canonical URLs.
  site: "https://example.com",
  output: "static",
  integrations: [react(), mdx()],

  // English is the unprefixed default, so adding `/es` later keeps every
  // existing English URL unchanged.
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
