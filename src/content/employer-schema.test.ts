import { describe, expect, test } from "vitest";

import { employerSchema } from "./employer-schema";

const valid = {
  name: "Bank",
  formerly: "Old Bank",
  context: "Placeholder context.",
  roles: [
    { title: "React Native Engineer", start: "2025-09" },
    { title: "React Developer", start: "2024-04", end: "2025-09" },
  ],
};

describe("employer schema", () => {
  test("accepts a valid entry and fills the defaults", () => {
    const employer = employerSchema.parse(valid);
    expect(employer.highlights).toEqual([]);
  });

  test("accepts a role starting the month the previous one ended", () => {
    expect(employerSchema.safeParse(valid).success).toBe(true);
  });

  test("rejects a month not written as YYYY-MM", () => {
    for (const start of ["2024-4", "2024-13", "Apr 2024"]) {
      const roles = [{ title: "Developer", start }];
      expect(employerSchema.safeParse({ ...valid, roles }).success).toBe(false);
    }
  });

  test("rejects a role that ends before it starts", () => {
    const roles = [{ title: "Developer", start: "2024-04", end: "2024-03" }];
    expect(employerSchema.safeParse({ ...valid, roles }).success).toBe(false);
  });

  test("rejects overlapping roles", () => {
    const overlapping = [
      { title: "Senior", start: "2025-06" },
      { title: "Junior", start: "2024-04", end: "2025-09" },
    ];
    expect(
      employerSchema.safeParse({ ...valid, roles: overlapping }).success,
    ).toBe(false);

    const twoCurrent = [
      { title: "Senior", start: "2025-09" },
      { title: "Junior", start: "2024-04" },
    ];
    expect(
      employerSchema.safeParse({ ...valid, roles: twoCurrent }).success,
    ).toBe(false);
  });

  test("rejects an employer with no roles", () => {
    expect(employerSchema.safeParse({ ...valid, roles: [] }).success).toBe(
      false,
    );
  });
});
