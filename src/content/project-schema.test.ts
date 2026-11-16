import { describe, expect, test } from "vitest";

import { projectSchema } from "./project-schema";

const valid = {
  title: "Design system",
  kind: "work",
  summary: "Placeholder summary.",
  role: "Frontend engineer",
  stack: ["React", "TypeScript"],
  order: 1,
  employer: "bank",
  context: "Placeholder context.",
  problem: "Placeholder problem.",
  steps: ["One.", "Two.", "Three.", "Four."],
  outcomes: ["One.", "Two.", "Three."],
  differently: "Placeholder line.",
};

const metric = { label: "brand variants", value: "2" };

const video = {
  src: "/media/pizca/loop.mp4",
  poster: "/media/pizca/poster.webp",
  description: "Placeholder description.",
  width: 1280,
  height: 720,
};

const diagram = {
  src: "/media/design-system/diagram.svg",
  alt: "Boxes.",
  width: 640,
  height: 320,
};

describe("project schema", () => {
  test("accepts a valid entry and fills the defaults", () => {
    const project = projectSchema.parse(valid);
    expect(project.metrics).toEqual([]);
    expect(project.featured).toBe(false);
  });

  test("rejects a kind outside work, personal and freelance", () => {
    expect(projectSchema.safeParse({ ...valid, kind: "side" }).success).toBe(
      false,
    );
  });

  test("allows up to 3 metrics", () => {
    const three = { ...valid, metrics: [metric, metric, metric] };
    expect(projectSchema.safeParse(three).success).toBe(true);
    const four = { ...valid, metrics: [metric, metric, metric, metric] };
    expect(projectSchema.safeParse(four).success).toBe(false);
  });

  test("requires an employer on work projects only", () => {
    const noEmployer = { ...valid, employer: undefined };
    expect(projectSchema.safeParse(noEmployer).success).toBe(false);

    const personal = { ...noEmployer, kind: "personal" };
    expect(projectSchema.safeParse(personal).success).toBe(true);
    expect(
      projectSchema.safeParse({ ...personal, employer: "bank" }).success,
    ).toBe(false);
  });

  test("rejects a missing title, an empty stack and a non-integer order", () => {
    const untitled = { ...valid, title: undefined };
    expect(projectSchema.safeParse(untitled).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, stack: [] }).success).toBe(
      false,
    );
    expect(projectSchema.safeParse({ ...valid, order: 1.5 }).success).toBe(
      false,
    );
  });
});

describe("case fields", () => {
  test("defaults links to none", () => {
    expect(projectSchema.parse(valid).links).toEqual([]);
  });

  test("requires exactly 4 steps and 3 outcomes", () => {
    const parse = (patch: object) =>
      projectSchema.safeParse({ ...valid, ...patch }).success;
    expect(parse({ steps: valid.steps.slice(0, 3) })).toBe(false);
    expect(parse({ steps: [...valid.steps, "Five."] })).toBe(false);
    expect(parse({ outcomes: valid.outcomes.slice(0, 2) })).toBe(false);
    expect(parse({ outcomes: [...valid.outcomes, "Four."] })).toBe(false);
  });

  test("limits context, problem and differently", () => {
    const parse = (patch: object) =>
      projectSchema.safeParse({ ...valid, ...patch }).success;
    expect(parse({ context: "x".repeat(160) })).toBe(true);
    expect(parse({ context: "x".repeat(161) })).toBe(false);
    expect(parse({ problem: "x".repeat(320) })).toBe(true);
    expect(parse({ problem: "x".repeat(321) })).toBe(false);
    expect(parse({ differently: "x".repeat(161) })).toBe(false);
    expect(parse({ problem: undefined })).toBe(false);
  });

  test("accepts https links only", () => {
    const link = (href: string) =>
      projectSchema.safeParse({ ...valid, links: [{ label: "Repo", href }] })
        .success;
    expect(link("https://github.com/")).toBe(true);
    expect(link("http://github.com/")).toBe(false);
    expect(link("/work/")).toBe(false);
  });

  test("rejects video on work cases and allows diagrams on any kind", () => {
    const personal = { ...valid, kind: "personal", employer: undefined };
    expect(
      projectSchema.safeParse({ ...valid, media: { video } }).success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({ ...personal, media: { video } }).success,
    ).toBe(true);
    expect(
      projectSchema.safeParse({ ...valid, media: { diagram } }).success,
    ).toBe(true);
  });

  test("requires media paths under /media/", () => {
    const outside = { ...diagram, src: "diagram.svg" };
    expect(
      projectSchema.safeParse({ ...valid, media: { diagram: outside } })
        .success,
    ).toBe(false);
  });
});
