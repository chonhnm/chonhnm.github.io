export function normalizeTags(tags = []) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    const trimmed = tags.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((tag) => tag.replace(/^['"]|['"]$/g, "").trim())
        .filter(Boolean);
    }

    return trimmed
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function slugifyTag(tag) {
  return String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripMarkdown(markdown = "") {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createExcerpt(markdown = "", limit = 160) {
  const plainText = stripMarkdown(markdown);

  if (plainText.length <= limit) {
    return plainText;
  }

  return `${plainText.slice(0, limit).trim()}…`;
}

export function calculateReadingTime(markdown = "") {
  const wordCount = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 220));
}

function parseFrontmatterValue(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return normalizeTags(trimmed);
  }

  return trimmed;
}

export function parseMarkdownUpload(source = "") {
  const normalizedSource = String(source || "");
  let body = normalizedSource;
  const data = {};

  if (normalizedSource.startsWith("---")) {
    const match = normalizedSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

    if (match) {
      const [, frontmatter, content] = match;
      body = content;
      const lines = frontmatter.split(/\r?\n/);
      let currentKey = null;

      lines.forEach((line) => {
        if (currentKey === "tags" && /^\s*-\s+/.test(line)) {
          data.tags = [...normalizeTags(data.tags), line.replace(/^\s*-\s+/, "").trim()];
          return;
        }

        const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

        if (!keyMatch) {
          currentKey = null;
          return;
        }

        const [, key, rawValue] = keyMatch;
        const parsedValue = parseFrontmatterValue(rawValue);
        data[key] = parsedValue;
        currentKey = key === "tags" && !rawValue.trim() ? "tags" : null;

        if (currentKey === "tags" && !Array.isArray(data.tags)) {
          data.tags = [];
        }
      });
    }
  }

  return {
    data: {
      ...data,
      tags: normalizeTags(data.tags),
      summary: data.summary || data.description || createExcerpt(body, 180),
    },
    body,
  };
}
