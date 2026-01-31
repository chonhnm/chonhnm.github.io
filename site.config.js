// site.config.js
// Edit these values to customize the homepage without touching components.

export const site = {
  title: "My Bad Opinions",
  subtitle: "Essays and notes on programming.",
  author: "Chon",
  nav: [
    { label: "blog", href: "/" },
    { label: "notes", href: "/notes" },
    { label: "about", href: "/about" },
  ],
  external: [
    { label: "GitHub", href: "https://github.com/chonhnm" },
  ],
  about: {
    title: "About",
    paragraphs: [
      "(Write something about yourself here.)",
    ],
  },
  notes: {
    title: "Notes",
    paragraphs: [
      "Shorter, less-polished writing. (Optional.)",
    ],
  },
};
