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
        <h1 className={utilStyles.heading2Xl}>{site.title}</h1>
        <p className={utilStyles.heroLead}>{site.subtitle}</p>
      </section>

      <section className={utilStyles.section}>
        <div className={utilStyles.sectionHeader}>
          <div>
            <h2 className={utilStyles.headingXl}>Latest posts</h2>
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
