import { describe, expect, test } from "vitest";

import { site } from "./site";

describe("site config", () => {
  test("has navigation items with internal or root-relative links", () => {
    expect(site.nav.length).toBeGreaterThan(0);
    for (const item of site.nav) {
      expect(item.label).not.toBe("");
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  test("keeps the email split into user and domain", () => {
    expect(site.email.user).not.toContain("@");
    expect(site.email.domain).toMatch(/^[\w-]+(\.[\w-]+)+$/);
  });

  test("points the CV link at a PDF served from public/", () => {
    expect(site.cvPath).toMatch(/^\/[\w-]+\.pdf$/);
    expect(site.nav.some((item) => item.href === site.cvPath)).toBe(true);
  });
});
