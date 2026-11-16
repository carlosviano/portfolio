import { z } from "astro/zod";

export const projectKinds = ["work", "personal", "freelance"] as const;

export type ProjectKind = (typeof projectKinds)[number];

export const kindLabels: Record<ProjectKind, string> = {
  work: "Work",
  personal: "Personal",
  freelance: "Freelance",
};

/** A file in `public/`, written as its site path ("/media/<slug>/…"). */
const publicPath = z.string().regex(/^\/media\/\S+$/, "Use a /media/… path");

/** Intrinsic size in px, so the page reserves the space before media loads. */
const size = {
  width: z.number().int().positive(),
  height: z.number().int().positive(),
};

/** Video loop and diagram on the case page; work cases can't have video. */
const mediaSchema = z.object({
  video: z
    .object({
      src: publicPath,
      poster: publicPath,
      /** What the loop shows, for screen readers and as its caption. */
      description: z.string().min(1).max(200),
      ...size,
    })
    .optional(),
  diagram: z
    .object({
      src: publicPath,
      /** Describes the structure the diagram shows. */
      alt: z.string().min(1),
      caption: z.string().min(1).optional(),
      ...size,
    })
    .optional(),
});

/**
 * Frontmatter of a `projects` entry: card fields plus the case-page template.
 * The template lives here rather than in the MDX body so the build enforces
 * it; the body is not rendered.
 */
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
    /** Case header: one line on the product and setting. */
    context: z.string().min(1).max(160),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.url({ protocol: /^https$/ }),
        }),
      )
      .default([]),
    /** 1–2 sentences. */
    problem: z.string().min(1).max(320),
    /** What I did: exactly 4 numbered steps. */
    steps: z.array(z.string().min(1)).length(4),
    outcomes: z.array(z.string().min(1)).length(3),
    /** What I'd do differently: one line. */
    differently: z.string().min(1).max(160),
    media: mediaSchema.optional(),
  })
  .superRefine(({ kind, employer, media }, ctx) => {
    if (kind === "work" && media?.video !== undefined) {
      ctx.addIssue({
        code: "custom",
        message:
          "Work cases can't show video (no screenshots of employer work)",
        path: ["media", "video"],
      });
    }
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
