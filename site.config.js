// site.config.js
// Edit these values to customize the homepage without touching components.

export const site = {
  title: "Chon's GitHub Blog",
  subtitle: "A simple personal blog for essays, notes, and engineering experiments.",
  description:
    "A GitHub-inspired personal blog with markdown publishing, tag browsing, and local markdown upload preview.",
  author: "Chon",
  intro: [
    "记录编程、系统设计和偶尔的技术碎碎念。",
    "文章使用 Markdown 维护，页面保持克制、清爽，适合长期阅读与归档。",
  ],
  nav: [
    { label: "blog", href: "/" },
    { label: "tags", href: "/tags" },
    { label: "upload", href: "/upload" },
    { label: "notes", href: "/notes" },
    { label: "about", href: "/about" },
  ],
  external: [
    { label: "GitHub", href: "https://github.com/chonhnm" },
    { label: "Email", href: "mailto:hello@chon.blog" },
  ],
  about: {
    title: "About",
    paragraphs: [
      "你好，我是 Chon，一名偏爱简洁工具链与长期写作的开发者。",
      "这里主要记录编程实践、阅读笔记，以及一些适合慢慢展开的技术主题。",
      "如果你也喜欢 Markdown、静态站点和 GitHub 风格的产品质感，这里大概会比较对胃口。",
    ],
  },
  notes: {
    title: "Notes",
    paragraphs: [
      "Notes 用来放置更短、更轻量的内容，比如想法草稿、会议摘要和实验记录。",
    ],
  },
  upload: {
    title: "Markdown Upload",
    paragraphs: [
      "上传本地 Markdown 文件，立即预览文章内容、摘要和标签。",
      "预览确认后，再把文件放进 `posts/` 目录即可作为正式博客文章发布。",
    ],
    tips: [
      "推荐 frontmatter 字段：title、date、summary、tags。",
      "tags 支持 YAML 数组或英文逗号分隔的字符串。",
      "页面不会把文件直接保存到仓库，它用于本地预览和校对。",
    ],
  },
};
