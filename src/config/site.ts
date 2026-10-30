export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  description: string;
  nav: NavItem[];
  /**
   * Split so the full address never appears in the HTML source;
   * EmailLink joins the parts in the browser.
   */
  email: { user: string; domain: string };
  links: { linkedin: string; github: string };
  /** Path to the CV PDF in `public/`. */
  cvPath: string;
}

// TODO(carlos): replace the placeholder email and profile links.
export const site: SiteConfig = {
  name: "Carlos Viano",
  role: "React & React Native engineer",
  description:
    "React & React Native engineer building web and mobile banking products.",
  nav: [
    { label: "Work", href: "/work/" },
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv.pdf" },
  ],
  email: { user: "hello", domain: "example.com" },
  links: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  cvPath: "/cv.pdf",
};
