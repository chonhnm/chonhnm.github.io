import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { getAllTags, getPostsByTag, getTagBySlug } from "../../lib/posts";
import { slugifyTag } from "../../lib/post-utils";

export default function TagDetailPage({ tag, posts }) {
  return (
    <Layout>
      <Head>
        <title>#{tag.name} · {siteTitle}</title>
      </Head>

      <section className={utilStyles.stack}>
        <span className={utilStyles.eyebrow}>Tag archive</span>
        <h1 className={utilStyles.headingXl}>#{tag.name}</h1>
        <p className={utilStyles.pageLead}>共 {posts.length} 篇文章，按发布时间倒序展示。</p>
      </section>

      <div className={utilStyles.cardGrid}>
        {posts.map((post) => (
          <article className={utilStyles.card} key={post.id}>
            <p className={utilStyles.cardMeta}>
              <Date dateString={post.date} /> · {post.readingTime} min read
            </p>
            <Link href={`/posts/${post.id}`} className={utilStyles.cardTitle}>
              {post.title}
            </Link>
            <p className={utilStyles.cardSummary}>{post.summary}</p>
            <ul className={utilStyles.tagList}>
              {post.tags.map((postTag) => (
                <li key={postTag}>
                  <Link href={`/tags/${slugifyTag(postTag)}`} className={utilStyles.tag}>
                    #{postTag}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: getAllTags().map((tag) => ({
      params: {
        slug: tag.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return {
    props: {
      tag: getTagBySlug(params.slug),
      posts: getPostsByTag(params.slug),
    },
  };
}
