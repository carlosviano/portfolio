import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { employerSchema } from "./content/employer-schema";
import { projectSchema } from "./content/project-schema";

// File name = slug = URL segment (`/work/<slug>/`).
const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/projects" }),
  schema: projectSchema,
});

// File name = employer id, referenced by work projects (`employer: <id>`).
const employers = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/employers" }),
  schema: employerSchema,
});

export const collections = { projects, employers };
