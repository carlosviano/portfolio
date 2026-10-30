import { describe, expect, test } from "vitest";

import type { ProjectKind } from "../content/project-schema";
import {
  formatRole,
  toWorkPage,
  type EmployerEntry,
  type ProjectEntry,
} from "./catalog";

function project(
  id: string,
  order: number,
  {
    kind = "work",
    employer = kind === "work" ? "bank" : undefined,
    featured = false,
  }: { kind?: ProjectKind; employer?: string; featured?: boolean } = {},
): ProjectEntry {
  return {
    id,
    data: {
      title: id,
      kind,
      summary: "Placeholder summary.",
      role: "TBD",
      stack: ["React"],
      metrics: [],
      featured,
      order,
      employer,
    },
  };
}

function employer(id: string, starts: string[]): EmployerEntry {
  return {
    id,
    data: {
      name: id,
      context: "Placeholder context.",
      roles: starts.map((start) => ({ title: `Role ${start}`, start })),
      highlights: [`Highlight at ${id}`],
    },
  };
}

const employers = [
  employer("studio", ["2023-03"]),
  employer("bank", ["2025-09", "2024-04"]),
];

const projects = [
  project("freelance-site", 4, { kind: "freelance", featured: true }),
  project("side-app", 3, { kind: "personal", featured: true }),
  project("bank-b", 2),
  project("bank-a", 1, { featured: true }),
];

describe("toWorkPage", () => {
  test("orders employers by most recent role, then Personal and Freelance", () => {
    const page = toWorkPage(projects, employers);
    expect(page.employers.map((section) => section.id)).toEqual([
      "bank",
      "studio",
    ]);
    expect(page.personal.map((item) => item.slug)).toEqual(["side-app"]);
    expect(page.freelance.map((item) => item.slug)).toEqual(["freelance-site"]);
  });

  test("sorts cards by order and numbers them across the page", () => {
    const page = toWorkPage(projects, employers);
    const items = [
      ...page.employers.flatMap((section) => section.items),
      ...page.personal,
      ...page.freelance,
    ];
    expect(items.map((item) => [item.slug, item.number])).toEqual([
      ["bank-a", "01"],
      ["bank-b", "02"],
      ["side-app", "03"],
      ["freelance-site", "04"],
    ]);
    expect(items[0]?.href).toBe("/work/bank-a/");
  });

  test("keeps an employer with no projects, with its highlights", () => {
    const [, studio] = toWorkPage(projects, employers).employers;
    expect(studio?.items).toEqual([]);
    expect(studio?.highlights).toEqual(["Highlight at studio"]);
  });

  test("formats each role's dates", () => {
    const [bank] = toWorkPage(projects, employers).employers;
    expect(bank?.roles[0]?.dates).toBe("Sept 2025 – Present");
  });

  test("throws on an unknown employer, naming the project and the id", () => {
    const typo = [...projects, project("bank-c", 5, { employer: "bnak" })];
    expect(() => toWorkPage(typo, employers)).toThrow(
      /"bank-c" references unknown employer "bnak"/,
    );
  });

  test("throws when two entries share an order, naming both", () => {
    expect(() =>
      toWorkPage([...projects, project("bank-c", 2)], employers),
    ).toThrow(/"bank-b" and "bank-c" share order 2/);
  });

  test("throws unless exactly 3 entries are featured", () => {
    expect(() => toWorkPage(projects.slice(1), employers)).toThrow(
      /Expected 3 featured projects, found 2: bank-a, side-app/,
    );
    const four = [...projects, project("bank-c", 5, { featured: true })];
    expect(() => toWorkPage(four, employers)).toThrow(/found 4/);
  });

  test("throws a restart hint when the collection is empty", () => {
    expect(() => toWorkPage([], employers)).toThrow(/restart the dev server/);
  });
});

describe("formatRole", () => {
  test("formats a current and a finished role", () => {
    expect(formatRole({ start: "2025-09" })).toBe("Sept 2025 – Present");
    expect(formatRole({ start: "2024-04", end: "2025-09" })).toBe(
      "Apr 2024 – Sept 2025",
    );
  });
});
