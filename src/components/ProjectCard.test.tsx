import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import type { CatalogItem } from "../lib/catalog";
import { ProjectCard } from "./ProjectCard";

const item: CatalogItem = {
  slug: "design-system",
  number: "01",
  href: "/work/design-system/",
  title: "Design system",
  kind: "work",
  summary: "Placeholder summary.",
  stack: ["React", "TypeScript"],
  metrics: [{ label: "brand variants", value: "2" }],
};

afterEach(cleanup);

describe("ProjectCard", () => {
  test("has one link, to the case page", () => {
    render(<ProjectCard item={item} />);
    const [link, ...rest] = screen.getAllByRole("link");
    expect(rest).toHaveLength(0);
    expect(link?.getAttribute("href")).toBe("/work/design-system/");
    expect(link?.textContent).toBe("Design system");
  });

  test("titles the card with an h3", () => {
    render(<ProjectCard item={item} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Design system" }),
    ).toBeTruthy();
  });

  test("shows the summary, metrics and stack", () => {
    render(<ProjectCard item={item} />);
    expect(screen.getByText("Placeholder summary.")).toBeTruthy();
    expect(screen.getByText("brand variants")).toBeTruthy();
    const stack = screen.getByRole("list", { name: "Stack" });
    expect(stack.textContent).toBe("ReactTypeScript");
  });
});
