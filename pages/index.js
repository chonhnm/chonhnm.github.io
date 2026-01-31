import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { site } from "../site.config";

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <h1 className={utilStyles.heading2Xl}>{site.title}</h1>

      <ul className={utilStyles.linkList}>
        {site.external?.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <p>{site.subtitle}</p>

      <h2 className={utilStyles.headingXl}>Oh, Hello There!</h2>

      <ul className={utilStyles.postList}>
        {allPostsData.map(({ id, date, title }) => (
          <li className={utilStyles.postItem} key={id}>
            <span className={utilStyles.postDate}>
              <Date dateString={date} /> —
            </span>{" "}
            <Link href={`/posts/${id}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
