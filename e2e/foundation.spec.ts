import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { site } from "../src/config/site";

const pages = ["/", "/work/", "/404"];
const address = `${site.email.user}@${site.email.domain}`;

test.describe("skip link (R3.3)", () => {
  test("is the first focusable element and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("email (R3.4)", () => {
  test("is absent from the HTML source but works as a mailto link", async ({
    page,
    request,
  }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toContain(address);

    await page.goto("/");
    await expect(page.getByRole("link", { name: address })).toHaveAttribute(
      "href",
      `mailto:${address}`,
    );
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the email as text", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(`${site.email.user} [at] ${site.email.domain}`),
    ).toBeVisible();
  });
});

test.describe("layout at 375 px (R3.5)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const path of pages) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("accessibility (R2.6)", () => {
  for (const path of pages) {
    test(`${path} has no axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe("404 (R5.1)", () => {
  test("unknown URLs render the not-found page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
  });
});
