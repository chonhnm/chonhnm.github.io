import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getAllTags, getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { slugifyTag } from "../lib/post-utils";
import { site } from "../site.config";

export default function Home({ allPostsData, tags }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={utilStyles.hero}>
        <span className={utilStyles.eyebrow}>Markdown-first publishing</span>
        <h1 className={utilStyles.heading2Xl}>{site.title}</h1>
        <p className={utilStyles.heroLead}>{site.subtitle}</p>

        <div className={utilStyles.introList}>
          {site.intro?.map((line) => (
            <p className={utilStyles.introItem} key={line}>
              {line}
            </p>
          ))}
        </div>

        <div className={utilStyles.heroActions}>
          <Link href="/upload" className={utilStyles.buttonPrimary}>
            Upload Markdown
          </Link>
          <Link href="/tags" className={utilStyles.buttonSecondary}>
            Browse Tags
          </Link>
        </div>
      </section>

      <section className={utilStyles.statsGrid}>
        <div className={utilStyles.statCard}>
          <p className={utilStyles.statLabel}>Published posts</p>
          <p className={utilStyles.statValue}>{allPostsData.length}</p>
        </div>
        <div className={utilStyles.statCard}>
          <p className={utilStyles.statLabel}>Available tags</p>
          <p className={utilStyles.statValue}>{tags.length}</p>
        </div>
        <div className={utilStyles.statCard}>
          <p className={utilStyles.statLabel}>Quick links</p>
          <p className={utilStyles.statValue}>{site.external?.length || 0}</p>
        </div>
      </section>

      <section className={utilStyles.section}>
        <div className={utilStyles.sectionHeader}>
          <div>
            <h2 className={utilStyles.headingXl}>Latest posts</h2>
            <p className={utilStyles.sectionDescription}>
              最近发布的文章，支持标签浏览与 Markdown 写作流程。
            </p>
          </div>
          <Link href="/tags" className={utilStyles.sectionLink}>
            View all tags
          </Link>
        </div>

        <div className={utilStyles.cardGrid}>
          {allPostsData.map(({ id, date, title, summary, tags: postTags, readingTime }) => (
            <article className={utilStyles.card} key={id}>
              <p className={utilStyles.cardMeta}>
                <Date dateString={date} /> · {readingTime} min read
              </p>
              <Link href={`/posts/${id}`} className={utilStyles.cardTitle}>
                {title}
              </Link>
              <p className={utilStyles.cardSummary}>{summary}</p>
              <ul className={utilStyles.tagList}>
                {postTags.map((tag) => (
                  <li key={tag}>
                    <Link href={`/tags/${slugifyTag(tag)}`} className={utilStyles.tag}>
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={utilStyles.section}>
        <div className={utilStyles.sectionHeader}>
          <div>
            <h2 className={utilStyles.headingXl}>Popular tags</h2>
            <p className={utilStyles.sectionDescription}>
              用标签快速归档主题，保持博客内容清晰可检索。
            </p>
          </div>
        </div>

        <ul className={utilStyles.tagList}>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link href={`/tags/${tag.slug}`} className={utilStyles.tag}>
                #{tag.name} <span className={utilStyles.tagCount}>{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const tags = getAllTags();
  return {
    props: {
      allPostsData,
      tags,
    },
  };
}
