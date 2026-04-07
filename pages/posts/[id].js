import utilStyles from "../../styles/utils.module.css";
import Layout, { siteTitle } from "../../components/layout";
import Date from "../../components/date";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Link from "next/link";
import { slugifyTag } from "../../lib/post-utils";

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>
          {postData.title} · {siteTitle}
        </title>
      </Head>

      <article className={utilStyles.article}>
        <header className={utilStyles.articleHeader}>
          <h1 className={utilStyles.articleTitle}>{postData.title}</h1>
          {postData.summary && (
            <p className={utilStyles.articleSummary}>{postData.summary}</p>
          )}
          <div className={utilStyles.articleMeta}>
            {postData.date && <Date dateString={postData.date} />}
            {postData.readingTime ? <span>{postData.readingTime} min read</span> : null}
          </div>
          {postData.tags?.length ? (
            <ul className={utilStyles.tagList}>
              {postData.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/${slugifyTag(tag)}`} className={utilStyles.tag}>
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </header>
        <div
          className={utilStyles.articleBody}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
