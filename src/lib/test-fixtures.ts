import type { ProjectKind } from "../content/project-schema";
import type { EmployerEntry, ProjectEntry } from "./catalog";

/** A valid `projects` entry with placeholder case fields, for unit tests. */
export function project(
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
      context: "Placeholder context.",
      links: [],
      problem: "Placeholder problem.",
      steps: ["One.", "Two.", "Three.", "Four."],
      outcomes: ["One.", "Two.", "Three."],
      differently: "Placeholder line.",
    },
  };
}

/** A valid `employers` entry; `starts` are role start months, most recent first. */
export function employer(id: string, starts: string[]): EmployerEntry {
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
