import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getAllTags } from "../../lib/posts";

export default function TagsPage({ tags }) {
  return (
    <Layout>
      <Head>
        <title>tags · {siteTitle}</title>
      </Head>

      <section className={utilStyles.stack}>
        <span className={utilStyles.eyebrow}>Topic explorer</span>
        <h1 className={utilStyles.headingXl}>Tags</h1>
        <p className={utilStyles.pageLead}>
          用标签浏览文章主题，快速找到同一类内容。
        </p>
      </section>

      {tags.length ? (
        <ul className={utilStyles.tagList}>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link href={`/tags/${tag.slug}`} className={utilStyles.tag}>
                #{tag.name} <span className={utilStyles.tagCount}>{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={utilStyles.emptyState}>还没有标签，先发布几篇文章吧。</div>
      )}
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      tags: getAllTags(),
    },
  };
}
