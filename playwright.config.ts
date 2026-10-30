import { defineConfig, devices } from "@playwright/test";

const port = 4391;

// End-to-end tests run against the built site, the same static files
// Cloudflare Pages will serve.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Two workarounds so Playwright can start and stop the server:
    // - Astro detaches `astro preview` into a background daemon when it detects
    //   an AI agent (e.g. Claude Code) from the environment; unsetting those
    //   variables keeps it in the foreground (no effect outside an agent).
    // - `exec` + the Astro binary directly, because `pnpm exec` doesn't forward
    //   the stop signal and the server would outlive the test run.
    command: `pnpm build && exec env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT node_modules/.bin/astro preview --port ${port}`,
    port,
    // Always serve a fresh build; reusing could pick up another project on the port.
    reuseExistingServer: false,
  },
});
