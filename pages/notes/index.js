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

      <h1 className={utilStyles.heading2Xl}>Notes</h1>

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
