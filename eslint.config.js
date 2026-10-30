// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs.recommended,
  // Accessibility rules for both React islands and Astro templates.
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [jsxA11y.flatConfigs.strict],
  },
  astro.configs["jsx-a11y-strict"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
);
