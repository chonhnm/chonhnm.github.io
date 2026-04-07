import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import {
  calculateReadingTime,
  createExcerpt,
  normalizeTags,
  slugifyTag,
} from "./post-utils";

const postsDirectory = path.join(process.cwd(), "posts");

function getPostFileNames() {
  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));
}

function getRawPost(fileName) {
  const id = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const tags = normalizeTags(matterResult.data.tags);

  return {
    id,
    content: matterResult.content,
    ...matterResult.data,
    tags,
    summary: matterResult.data.summary || createExcerpt(matterResult.content),
    readingTime: calculateReadingTime(matterResult.content),
  };
}

export function getSortedPostsData() {
  const allPostsData = getPostFileNames().map(getRawPost);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = getPostFileNames();

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const post = getRawPost(`${id}.md`);
  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return {
    ...post,
    contentHtml,
  };
}

export function getAllTags() {
  const tags = new Map();

  getSortedPostsData().forEach((post) => {
    post.tags.forEach((tag) => {
      const slug = slugifyTag(tag);

      if (!slug) {
        return;
      }

      if (!tags.has(slug)) {
        tags.set(slug, {
          slug,
          name: tag,
          count: 0,
        });
      }

      tags.get(slug).count += 1;
    });
  });

  return Array.from(tags.values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.name.localeCompare(b.name);
  });
}

export function getPostsByTag(tagSlug) {
  return getSortedPostsData().filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === tagSlug)
  );
}

export function getTagBySlug(tagSlug) {
  return getAllTags().find((tag) => tag.slug === tagSlug) || null;
}
