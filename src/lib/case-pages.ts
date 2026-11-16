import type { Project } from "../content/project-schema";
import { toWorkPage, type EmployerEntry, type ProjectEntry } from "./catalog";

export interface NextLink {
  number: string;
  title: string;
  href: string;
}

/** Everything `/work/<slug>/` renders, in template order. */
export interface CasePage {
  slug: string;
  /** Same number as the card on `/work`. */
  number: string;
  title: string;
  summary: string;
  role: string;
  context: string;
  stack: string[];
  links: Project["links"];
  problem: string;
  steps: string[];
  outcomes: string[];
  differently: string;
  media?: Project["media"];
  next: NextLink;
}

/** Constitution, content rules: media budget per case (R3.6). */
export const mediaBudget = {
  videoBytes: 2_000_000,
  posterBytes: 200_000,
  posterTypes: [".webp", ".jpg", ".jpeg"],
};

/**
 * Builds every case page in `/work` display order. Goes through
 * `toWorkPage` so the cross-entry checks and the numbering are shared.
 */
export function toCasePages(
  projects: ProjectEntry[],
  employers: EmployerEntry[],
): CasePage[] {
  const page = toWorkPage(projects, employers);
  const items = [
    ...page.employers.flatMap((section) => section.items),
    ...page.personal,
    ...page.freelance,
  ];
  const byId = new Map(projects.map((entry) => [entry.id, entry.data]));

  return items.map((item, index) => {
    const data = byId.get(item.slug);
    if (data === undefined) throw new Error(`No entry for "${item.slug}".`);
    // The last case wraps to the first (R5.2).
    const next = items[(index + 1) % items.length] ?? item;
    return {
      slug: item.slug,
      number: item.number,
      title: data.title,
      summary: data.summary,
      role: data.role,
      context: data.context,
      stack: data.stack,
      links: data.links,
      problem: data.problem,
      steps: data.steps,
      outcomes: data.outcomes,
      differently: data.differently,
      media: data.media,
      next: { number: next.number, title: next.title, href: next.href },
    };
  });
}

/** Size in bytes of a file in `public/`, or `undefined` if it's missing. */
export type StatFile = (publicPath: string) => number | undefined;

const kb = (bytes: number) => Math.ceil(bytes / 1000);

/**
 * Fails the build on a missing media file or one over the budget (R3.5).
 * Duration and width need `ffprobe`, so they're checked by hand.
 */
export function checkMedia(page: CasePage, stat: StatFile): void {
  const fail = (message: string) => {
    throw new Error(`Case "${page.slug}": ${message}`);
  };
  const size = (path: string) => {
    const bytes = stat(path);
    return bytes === undefined ? fail(`${path} is missing`) : bytes;
  };
  const withinBudget = (path: string, budget: number) => {
    const bytes = size(path);
    if (bytes > budget) {
      fail(`${path} is ${kb(bytes)} KB, over the ${kb(budget)} KB budget`);
    }
  };

  const { video, diagram } = page.media ?? {};
  if (video !== undefined) {
    if (!video.src.endsWith(".mp4")) fail(`${video.src} is not an MP4`);
    withinBudget(video.src, mediaBudget.videoBytes);
    const posterType = video.poster.slice(video.poster.lastIndexOf("."));
    if (!mediaBudget.posterTypes.includes(posterType.toLowerCase())) {
      fail(`${video.poster} must be WebP or JPEG`);
    }
    withinBudget(video.poster, mediaBudget.posterBytes);
  }
  if (diagram !== undefined) size(diagram.src);
}
