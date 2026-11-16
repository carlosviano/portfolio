import { describe, expect, test } from "vitest";

import { toWorkPage } from "./catalog";
import {
  checkMedia,
  mediaBudget,
  toCasePages,
  type CasePage,
} from "./case-pages";
import { employer, project } from "./test-fixtures";

const employers = [
  employer("studio", ["2023-03"]),
  employer("bank", ["2025-09", "2024-04"]),
];

const projects = [
  project("freelance-site", 4, { kind: "freelance", featured: true }),
  project("side-app", 3, { kind: "personal", featured: true }),
  project("bank-b", 2),
  project("bank-a", 1, { featured: true }),
];

describe("toCasePages", () => {
  test("builds one page per entry in /work display order", () => {
    const pages = toCasePages(projects, employers);
    expect(pages.map((page) => page.slug)).toEqual([
      "bank-a",
      "bank-b",
      "side-app",
      "freelance-site",
    ]);
  });

  test("uses the same numbers as the /work cards", () => {
    const work = toWorkPage(projects, employers);
    const cards = [
      ...work.employers.flatMap((section) => section.items),
      ...work.personal,
      ...work.freelance,
    ];
    expect(toCasePages(projects, employers).map((page) => page.number)).toEqual(
      cards.map((card) => card.number),
    );
  });

  test("links each case to the next and wraps the last to the first", () => {
    const pages = toCasePages(projects, employers);
    expect(pages.map((page) => page.next.href)).toEqual([
      "/work/bank-b/",
      "/work/side-app/",
      "/work/freelance-site/",
      "/work/bank-a/",
    ]);
    expect(pages[3]?.next).toEqual({
      number: "01",
      title: "bank-a",
      href: "/work/bank-a/",
    });
  });

  test("keeps the case fields from the entry", () => {
    const [page] = toCasePages(projects, employers);
    expect(page?.steps).toHaveLength(4);
    expect(page?.outcomes).toHaveLength(3);
    expect(page?.links).toEqual([]);
  });
});

describe("checkMedia", () => {
  const base = toCasePages(projects, employers)[2] as CasePage;
  const withMedia = (media: CasePage["media"]): CasePage => ({
    ...base,
    media,
  });
  const video = {
    src: "/media/side-app/loop.mp4",
    poster: "/media/side-app/poster.webp",
    description: "Placeholder.",
    width: 1280,
    height: 720,
  };
  const diagram = {
    src: "/media/side-app/diagram.svg",
    alt: "Boxes.",
    width: 640,
    height: 320,
  };
  const files = (sizes: Record<string, number>) => (path: string) =>
    sizes[path];
  const allFiles = files({
    [video.src]: 1_500_000,
    [video.poster]: 100_000,
    [diagram.src]: 2_000,
  });

  test("passes a case without media and a valid set", () => {
    expect(() => checkMedia(base, files({}))).not.toThrow();
    expect(() =>
      checkMedia(withMedia({ video, diagram }), allFiles),
    ).not.toThrow();
  });

  test("names the case and the file when one is missing", () => {
    expect(() => checkMedia(withMedia({ diagram }), files({}))).toThrow(
      'Case "side-app": /media/side-app/diagram.svg is missing',
    );
    expect(() =>
      checkMedia(withMedia({ video }), files({ [video.src]: 1 })),
    ).toThrow("/media/side-app/poster.webp is missing");
  });

  test("rejects a video or poster over budget", () => {
    const bigVideo = files({
      [video.src]: mediaBudget.videoBytes + 1,
      [video.poster]: 1,
    });
    expect(() => checkMedia(withMedia({ video }), bigVideo)).toThrow(
      "/media/side-app/loop.mp4 is 2001 KB, over the 2000 KB budget",
    );
    const bigPoster = files({
      [video.src]: 1,
      [video.poster]: mediaBudget.posterBytes + 1,
    });
    expect(() => checkMedia(withMedia({ video }), bigPoster)).toThrow(
      "over the 200 KB budget",
    );
  });

  test("rejects a PNG poster and a non-MP4 video", () => {
    const png = { ...video, poster: "/media/side-app/poster.png" };
    expect(() => checkMedia(withMedia({ video: png }), allFiles)).toThrow(
      "must be WebP or JPEG",
    );
    const webm = { ...video, src: "/media/side-app/loop.webm" };
    expect(() => checkMedia(withMedia({ video: webm }), allFiles)).toThrow(
      "is not an MP4",
    );
  });
});
