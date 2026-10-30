import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const cards = (page: Page) => page.locator("main article");
const section = (page: Page, name: string) =>
  page.getByRole("region", { name: new RegExp(`^${name}`) });

test.describe("work page sections (R3.1, R3.2, R3.5, R3.8)", () => {
  test("puts employers first, then Personal and Freelance", async ({
    page,
  }) => {
    await page.goto("/work/");
    const headings = await page
      .getByRole("heading", { level: 2 })
      .allTextContents();
    expect(headings.map((text) => text.trim())).toEqual([
      expect.stringMatching(/^Avarda Bank\s+formerly TF Bank$/),
      "DecoDy Software",
      "Personal",
      "Freelance",
    ]);
  });

  test("shows each employer's roles, most recent first", async ({ page }) => {
    await page.goto("/work/");
    const roles = section(page, "Avarda Bank").locator("header li");
    await expect(roles).toHaveText([
      "React Native Engineer · Sept 2025 – Present",
      "React Developer · Apr 2024 – Sept 2025",
    ]);
  });

  test("shows an employer with no cards with its highlights", async ({
    page,
  }) => {
    await page.goto("/work/");
    const decody = section(page, "DecoDy Software");
    await expect(decody.locator("article")).toHaveCount(0);
    await expect(
      decody.getByRole("list", { name: "Highlights" }).getByRole("listitem"),
    ).not.toHaveCount(0);
  });
});

test.describe("cards (R3.3, R3.4)", () => {
  test("numbers the cards 01 to 08 across the page", async ({ page }) => {
    await page.goto("/work/");
    const numbers = await cards(page)
      .locator("> p:first-child")
      .allTextContents();
    expect(numbers).toEqual(
      Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  test("gives each card exactly one link to its case page", async ({
    page,
  }) => {
    await page.goto("/work/");
    await expect(cards(page)).toHaveCount(8);
    for (const card of await cards(page).all()) {
      const links = card.getByRole("link");
      await expect(links).toHaveCount(1);
      await expect(links).toHaveAttribute("href", /^\/work\/[a-z0-9-]+\/$/);
    }
  });
});

test("ships no JavaScript of its own (R3.7)", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.locator("astro-island")).toHaveCount(0);
  // The only script is the layout's email link.
  const scripts = await page
    .locator("script")
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
  expect(scripts).toHaveLength(1);
  expect(scripts[0]).toContain("data-email-user");
});

test("has no axe violations", async ({ page }) => {
  await page.goto("/work/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test.describe("at 375 px (R3.6)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("has no horizontal scroll", async ({ page }) => {
    await page.goto("/work/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
