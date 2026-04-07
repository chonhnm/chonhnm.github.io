import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { parseMarkdownUpload } from "../lib/post-utils";
import { site } from "../site.config";

const defaultMarkdown = `---
title: "My Next Post"
date: "2026-04-07"
summary: "A short summary for the post card."
tags:
  - Blog
  - Markdown
---

# Hello Markdown

Write your article here, or upload a local \`.md\` file to preview it.

- Supports frontmatter
- Supports tags
- Supports rendered preview
`;

export default function UploadPage() {
  const [source, setSource] = useState(defaultMarkdown);
  const [fileName, setFileName] = useState("example.md");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => parseMarkdownUpload(source), [source]);

  useEffect(() => {
    let cancelled = false;

    async function renderPreview() {
      if (!parsed.body.trim()) {
        setPreviewHtml("");
        return;
      }

      setIsRendering(true);
      setError("");

      try {
        const [{ remark }, { default: html }] = await Promise.all([
          import("remark"),
          import("remark-html"),
        ]);
        const processed = await remark().use(html).process(parsed.body);

        if (!cancelled) {
          setPreviewHtml(processed.toString());
        }
      } catch {
        if (!cancelled) {
          setError("Markdown preview could not be rendered.");
          setPreviewHtml("");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    }

    renderPreview();

    return () => {
      cancelled = true;
    };
  }, [parsed.body]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setSource(await file.text());
  }

  return (
    <Layout>
      <Head>
        <title>upload · {siteTitle}</title>
      </Head>

      <section className={utilStyles.stack}>
        <span className={utilStyles.eyebrow}>Local article workflow</span>
        <h1 className={utilStyles.headingXl}>{site.upload.title}</h1>
        {site.upload.paragraphs.map((paragraph) => (
          <p className={utilStyles.pageLead} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={utilStyles.uploadLayout}>
        <div className={utilStyles.uploadPanel}>
          <h2 className={utilStyles.headingLg}>Markdown source</h2>
          <p className={utilStyles.lightText}>
            当前文件：<strong>{fileName}</strong>
          </p>
          <input
            accept=".md,.markdown,text/markdown"
            className={utilStyles.uploadInput}
            onChange={handleFileChange}
            type="file"
          />
          <textarea
            className={utilStyles.sourceEditor}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            value={source}
          />
          <h3 className={utilStyles.headingLg}>Tips</h3>
          <ul className={utilStyles.helperList}>
            {site.upload.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={utilStyles.uploadPanel}>
          <h2 className={utilStyles.headingLg}>Preview metadata</h2>
          <div className={utilStyles.uploadMetaGrid}>
            <div className={utilStyles.uploadMeta}>
              <p className={utilStyles.uploadMetaLabel}>Title</p>
              <p className={utilStyles.uploadMetaValue}>
                {parsed.data.title || "Untitled draft"}
              </p>
            </div>
            <div className={utilStyles.uploadMeta}>
              <p className={utilStyles.uploadMetaLabel}>Date</p>
              <p className={utilStyles.uploadMetaValue}>
                {parsed.data.date || "No date"}
              </p>
            </div>
            <div className={utilStyles.uploadMeta}>
              <p className={utilStyles.uploadMetaLabel}>Summary</p>
              <p className={utilStyles.uploadMetaValue}>
                {parsed.data.summary || "No summary"}
              </p>
            </div>
            <div className={utilStyles.uploadMeta}>
              <p className={utilStyles.uploadMetaLabel}>Tags</p>
              <p className={utilStyles.uploadMetaValue}>
                {parsed.data.tags?.length ? parsed.data.tags.join(", ") : "No tags"}
              </p>
            </div>
          </div>

          <div className={utilStyles.previewShell}>
            <p className={utilStyles.cardMeta}>
              {isRendering ? "Rendering preview…" : error || "Rendered preview"}
            </p>
            <h2 className={utilStyles.headingLg}>
              {parsed.data.title || "Untitled draft"}
            </h2>
            {parsed.data.summary ? (
              <p className={utilStyles.cardSummary}>{parsed.data.summary}</p>
            ) : null}
            {parsed.data.tags?.length ? (
              <ul className={utilStyles.tagList}>
                {parsed.data.tags.map((tag) => (
                  <li key={tag}>
                    <span className={utilStyles.tag}>#{tag}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div
              className={utilStyles.articleBody}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
