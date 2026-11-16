// @vitest-environment node
// The Astro container can't render `.astro` files under jsdom.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, test } from "vitest";

import CaseDiagram from "./CaseDiagram.astro";
import CaseHeader from "./CaseHeader.astro";
import CaseVideo from "./CaseVideo.astro";
import NextProject from "./NextProject.astro";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

async function render(
  component: Parameters<AstroContainer["renderToString"]>[0],
  props: Record<string, unknown>,
) {
  const html = await container.renderToString(component, { props });
  return new JSDOM(html).window.document;
}

const header = {
  title: "Pizca",
  role: "Solo developer",
  context: "Placeholder context.",
  stack: ["React Native", "Expo"],
  links: [],
};

const video = {
  src: "/media/pizca/loop.mp4",
  poster: "/media/pizca/poster.webp",
  description: "The order screen updating as a draft is approved.",
  width: 1280,
  height: 720,
};

describe("CaseHeader (R2.2, R2.3)", () => {
  test("shows Role, Context and Stack, and no Links row without links", async () => {
    const doc = await render(CaseHeader, { page: header });
    expect(doc.querySelector("h1")?.textContent).toBe("Pizca");
    const terms = [...doc.querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(terms).toEqual(["Role", "Context", "Stack"]);
  });

  test("adds a Links row when the case has links", async () => {
    const links = [{ label: "Source on GitHub", href: "https://github.com/" }];
    const doc = await render(CaseHeader, { page: { ...header, links } });
    const terms = [...doc.querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(terms.at(-1)).toBe("Links");
    expect(doc.querySelector("dd a")?.getAttribute("href")).toBe(
      "https://github.com/",
    );
  });
});

describe("CaseVideo (R3.1–R3.4)", () => {
  test("renders a muted inline loop with controls and a poster, without autoplay", async () => {
    const doc = await render(CaseVideo, { video, id: "pizca" });
    const element = doc.querySelector("video");
    for (const attribute of ["muted", "loop", "playsinline", "controls"]) {
      expect(element?.hasAttribute(attribute), attribute).toBe(true);
    }
    expect(element?.hasAttribute("autoplay")).toBe(false);
    expect(element?.getAttribute("poster")).toBe(video.poster);
    expect(doc.querySelector("source")?.getAttribute("src")).toBe(video.src);
  });

  test("links the description to the video", async () => {
    const doc = await render(CaseVideo, { video, id: "pizca" });
    const describedBy = doc
      .querySelector("video")
      ?.getAttribute("aria-describedby");
    expect(doc.getElementById(describedBy ?? "")?.textContent?.trim()).toBe(
      video.description,
    );
  });

  test("starts the loop only without a reduced-motion preference", async () => {
    const doc = await render(CaseVideo, { video, id: "pizca" });
    expect(doc.querySelector("script")?.textContent).toContain(
      "(prefers-reduced-motion: no-preference)",
    );
  });
});

describe("CaseDiagram (R4)", () => {
  const diagram = {
    src: "/media/design-system/diagram.svg",
    alt: "Tokens feed components, which feed two brand apps.",
    width: 640,
    height: 320,
  };

  test("renders the image with its alt text and size", async () => {
    const doc = await render(CaseDiagram, { diagram });
    const image = doc.querySelector("figure img");
    expect(image?.getAttribute("alt")).toBe(diagram.alt);
    expect(image?.getAttribute("width")).toBe("640");
    expect(doc.querySelector("figcaption")).toBeNull();
  });

  test("adds the caption when there is one", async () => {
    const doc = await render(CaseDiagram, {
      diagram: { ...diagram, caption: "Two brands." },
    });
    expect(doc.querySelector("figcaption")?.textContent?.trim()).toBe(
      "Two brands.",
    );
  });
});

describe("NextProject (R5.1)", () => {
  test("links to the next case with its number and title", async () => {
    const doc = await render(NextProject, {
      next: { number: "03", title: "Cash-to-account", href: "/work/cash/" },
    });
    const link = doc.querySelector("nav a");
    expect(link?.getAttribute("href")).toBe("/work/cash/");
    expect(link?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "03 · Cash-to-account",
    );
  });
});
