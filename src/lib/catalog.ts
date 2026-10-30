import type { Employer } from "../content/employer-schema";
import type { Project, ProjectKind } from "../content/project-schema";

/** Plain, serialisable card data. */
export interface CatalogItem {
  slug: string;
  /** Zero-padded position across the whole page ("01", "02", …). */
  number: string;
  href: string;
  title: string;
  kind: ProjectKind;
  summary: string;
  stack: string[];
  metrics: Project["metrics"];
}

export interface RoleItem {
  title: string;
  /** "Sept 2025 – Present". */
  dates: string;
  start: string;
  end?: string | undefined;
}

export interface EmployerSection {
  id: string;
  name: string;
  formerly?: string | undefined;
  context: string;
  roles: RoleItem[];
  highlights: string[];
  items: CatalogItem[];
}

/** `/work`: employers (most recent first), then Personal, then Freelance. */
export interface WorkPage {
  employers: EmployerSection[];
  personal: CatalogItem[];
  freelance: CatalogItem[];
}

/** The shape of a `projects` collection entry that the page needs. */
export interface ProjectEntry {
  id: string;
  data: Project;
}

/** The shape of an `employers` collection entry that the page needs. */
export interface EmployerEntry {
  id: string;
  data: Employer;
}

/** Constitution: the featured set is exactly 3 cards. */
export const featuredCount = 3;

const monthFormat = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "Sept 2025" for "2025-09". */
export function formatMonth(month: string): string {
  const [year, monthIndex] = month.split("-").map(Number);
  return monthFormat.format(Date.UTC(year ?? 0, (monthIndex ?? 1) - 1));
}

/** "Apr 2024 – Sept 2025", or "Sept 2025 – Present" for a current role. */
export function formatRole(role: {
  start: string;
  end?: string | undefined;
}): string {
  const end = role.end === undefined ? "Present" : formatMonth(role.end);
  return `${formatMonth(role.start)} – ${end}`;
}

function latestStart(employer: Employer): string {
  return employer.roles.reduce(
    (latest, role) => (role.start > latest ? role.start : latest),
    "",
  );
}

/**
 * Builds the `/work` page model and checks the rules that span entries, so a
 * broken catalog fails the build instead of rendering a wrong page.
 */
export function toWorkPage(
  projects: ProjectEntry[],
  employers: EmployerEntry[],
): WorkPage {
  if (projects.length === 0) {
    throw new Error(
      "No project entries found; restart the dev server if you just added content config.",
    );
  }

  const sorted = [...projects].sort((a, b) => a.data.order - b.data.order);

  for (let i = 1; i < sorted.length; i++) {
    const [prev, next] = [sorted[i - 1], sorted[i]];
    if (prev && next && prev.data.order === next.data.order) {
      throw new Error(
        `Projects "${prev.id}" and "${next.id}" share order ${next.data.order}.`,
      );
    }
  }

  const featured = sorted.filter((entry) => entry.data.featured);
  if (featured.length !== featuredCount) {
    const slugs = featured.map((entry) => entry.id).join(", ") || "none";
    throw new Error(
      `Expected ${featuredCount} featured projects, found ${featured.length}: ${slugs}.`,
    );
  }

  const employerIds = new Set(employers.map((employer) => employer.id));
  for (const { id, data } of sorted) {
    if (data.kind !== "work") continue;
    if (data.employer === undefined || !employerIds.has(data.employer)) {
      throw new Error(
        `Project "${id}" references unknown employer "${data.employer ?? ""}".`,
      );
    }
  }

  const orderedEmployers = [...employers].sort((a, b) =>
    latestStart(b.data).localeCompare(latestStart(a.data)),
  );

  // Numbering runs through the page in display order.
  let count = 0;
  const toItems = (entries: ProjectEntry[]): CatalogItem[] =>
    entries.map(({ id, data }) => ({
      slug: id,
      number: String(++count).padStart(2, "0"),
      href: `/work/${id}/`,
      title: data.title,
      kind: data.kind,
      summary: data.summary,
      stack: data.stack,
      metrics: data.metrics,
    }));

  return {
    employers: orderedEmployers.map(({ id, data }) => ({
      id,
      name: data.name,
      formerly: data.formerly,
      context: data.context,
      roles: data.roles.map((role) => ({ ...role, dates: formatRole(role) })),
      highlights: data.highlights,
      items: toItems(sorted.filter((entry) => entry.data.employer === id)),
    })),
    personal: toItems(sorted.filter((entry) => entry.data.kind === "personal")),
    freelance: toItems(
      sorted.filter((entry) => entry.data.kind === "freelance"),
    ),
  };
}
