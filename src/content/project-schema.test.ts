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
};

const metric = { label: "brand variants", value: "2" };

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
