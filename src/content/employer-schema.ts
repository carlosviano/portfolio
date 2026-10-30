import { z } from "astro/zod";

/** `YYYY-MM`. These strings sort chronologically, so roles compare without date parsing. */
const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected a month as YYYY-MM");

const roleSchema = z.object({
  title: z.string().min(1),
  start: month,
  /** Absent for a current role ("Present"). */
  end: month.optional(),
});

/** An `employers` entry (YAML). Projects point at it by file name (`employer: <id>`). */
export const employerSchema = z
  .object({
    name: z.string().min(1),
    /** Name before a rebrand, shown as "formerly …". */
    formerly: z.string().min(1).optional(),
    /** One line under the employer name. */
    context: z.string().min(1).max(160),
    /** Listed most recent first. */
    roles: z.array(roleSchema).min(1),
    /** One-liners for work that isn't a full case. */
    highlights: z.array(z.string().min(1)).default([]),
  })
  .superRefine(({ roles }, ctx) => {
    roles.forEach((role, i) => {
      if (role.end !== undefined && role.end < role.start) {
        ctx.addIssue({
          code: "custom",
          message: `Role "${role.title}" ends before it starts`,
          path: ["roles", i, "end"],
        });
      }
    });

    // A role may start in the month the previous one ended (a handover).
    const byStart = [...roles].sort((a, b) => a.start.localeCompare(b.start));
    byStart.forEach((next, i) => {
      const previous = byStart[i - 1];
      if (previous === undefined) return;
      if (previous.end === undefined || previous.end > next.start) {
        ctx.addIssue({
          code: "custom",
          message: `Roles "${previous.title}" and "${next.title}" overlap`,
          path: ["roles"],
        });
      }
    });
  });

export type Employer = z.infer<typeof employerSchema>;
