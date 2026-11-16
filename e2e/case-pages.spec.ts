import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Case page hrefs in `/work` card order. */
async function caseLinks(page: Page): Promise<string[]> {
  await page.goto("/work/");
  return page
    .locator("main article a")
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
}

test.describe("case pages (R2.1, R2.4)", () => {
  test("every /work card opens a case page titled like the card", async ({
    page,
  }) => {
    await page.goto("/work/");
    const cards = await page.locator("main article a").evaluateAll((links) =>
      links.map((link) => ({
        href: link.getAttribute("href") ?? "",
        title: link.textContent?.trim() ?? "",
      })),
    );
    expect(cards).toHaveLength(8);
    for (const { href, title } of cards) {
      const response = await page.goto(href);
      expect(response?.status(), href).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page).toHaveTitle(new RegExp(`^${title} — `));
    }
  });
});

test.describe("template (R2.2, R2.3, R2.5, R4)", () => {
  test("puts the sections in template order", async ({ page }) => {
    await page.goto("/work/design-system/");
    const headings = await page
      .getByRole("heading", { level: 2 })
      .allTextContents();
    expect(headings.map((text) => text.trim())).toEqual([
      "Problem",
      "What I did",
      "Outcome",
      "What I'd do differently",
      "Media",
      "Next project",
    ]);
  });

  test("shows 4 numbered steps and 3 outcomes", async ({ page }) => {
    await page.goto("/work/design-system/");
    const section = (name: string) => page.getByRole("region", { name });
    await expect(section("What I did").locator("ol > li")).toHaveCount(4);
    await expect(section("Outcome").locator("ul > li")).toHaveCount(3);
  });

  test("shows Links only on cases that have them", async ({ page }) => {
    await page.goto("/work/this-site/");
    await expect(page.locator("header dt").last()).toHaveText("Links");
    await page.goto("/work/pizca/");
    await expect(page.locator("header dt")).toHaveText([
      "Role",
      "Context",
      "Stack",
    ]);
  });

  test("shows the diagram with its alt text", async ({ page }) => {
    await page.goto("/work/design-system/");
    const diagram = page
      .getByRole("region", { name: "Media" })
      .getByRole("img");
    await expect(diagram).toHaveAttribute("alt", /\S/);
    expect(
      await diagram.evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
  });

  test("has no Media section without media", async ({ page }) => {
    await page.goto("/work/pizca/");
    await expect(page.getByRole("region", { name: "Media" })).toHaveCount(0);
  });
});

test("next project visits every case in /work order and wraps (R5)", async ({
  page,
}) => {
  const order = await caseLinks(page);
  const visited: string[] = [];
  let href = order[0] ?? "";
  for (let i = 0; i < order.length; i++) {
    visited.push(href);
    await page.goto(href);
    href =
      (await page
        .getByRole("navigation", { name: "Next project" })
        .getByRole("link")
        .getAttribute("href")) ?? "";
  }
  expect(visited).toEqual(order);
  expect(href).toBe(order[0]);
});

test("a case without video ships no JavaScript of its own (R2.7)", async ({
  page,
}) => {
  await page.goto("/work/design-system/");
  const scripts = await page
    .locator("script")
    .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
  expect(scripts).toHaveLength(1);
  expect(scripts[0]).toContain("data-email-user");
});

test("has no axe violations on any case page", async ({ page }) => {
  for (const href of await caseLinks(page)) {
    await page.goto(href);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, href).toEqual([]);
  }
});

test.describe("at 375 px (R2.6)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("has no horizontal scroll on any case page", async ({ page }) => {
    for (const href of await caseLinks(page)) {
      await page.goto(href);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, href).toBeLessThanOrEqual(0);
    }
  });
});
