import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getSortedNotesData } from "../../lib/notes";
import Link from "next/link";
import Date from "../../components/date";

export default function Notes({ allNotesData }) {
  return (
    <Layout>
      <Head>
        <title>notes · {siteTitle}</title>
      </Head>

      <section className={utilStyles.stack}>
        <span className={utilStyles.eyebrow}>Short-form writing</span>
        <h1 className={utilStyles.headingXl}>Notes</h1>
        <p className={utilStyles.pageLead}>
          {allNotesData.length
            ? "收集更短的技术记录、临时想法与实验摘要。"
            : "这里会放一些更短的技术记录与草稿。"}
        </p>
      </section>

      <ul className={utilStyles.postList}>
        {allNotesData.map(({ id, date, title }) => (
          <li className={utilStyles.postItem} key={id}>
            <span className={utilStyles.postDate}>
              {date ? <Date dateString={date} /> : ""} {date ? "—" : ""}
            </span>{" "}
            <Link href={`/notes/${id}`}>{title || id}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export function getStaticProps() {
  const allNotesData = getSortedNotesData();
  return {
    props: {
      allNotesData,
    },
  };
}
