import { z } from "astro/zod";

export const projectKinds = ["work", "personal", "freelance"] as const;

export type ProjectKind = (typeof projectKinds)[number];

export const kindLabels: Record<ProjectKind, string> = {
  work: "Work",
  personal: "Personal",
  freelance: "Freelance",
};

/** Frontmatter of a `projects` entry. The MDX body is the case-page copy (003). */
export const projectSchema = z
  .object({
    title: z.string().min(1),
    kind: z.enum(projectKinds),
    /** One sentence for the card. */
    summary: z.string().min(1).max(160),
    role: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    /** Content rules: up to 3 numbers per card. */
    metrics: z
      .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
      .max(3)
      .default([]),
    featured: z.boolean().default(false),
    /** Position in the catalog; unique across entries (checked in `toWorkPage`). */
    order: z.number().int().positive(),
    /**
     * Employer id (its file name) for `work` projects. A plain string rather than
     * `reference()` so this module stays testable; `toWorkPage` checks the id exists.
     */
    employer: z.string().min(1).optional(),
  })
  .superRefine(({ kind, employer }, ctx) => {
    if (kind === "work" && employer === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "A work project needs an employer",
        path: ["employer"],
      });
    }
    if (kind !== "work" && employer !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: `A ${kind} project can't have an employer`,
        path: ["employer"],
      });
    }
  });

export type Project = z.infer<typeof projectSchema>;
