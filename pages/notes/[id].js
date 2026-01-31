import Layout from "../../components/layout";
import Date from "../../components/date";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { getAllNoteIds, getNoteData } from "../../lib/notes";
import { siteTitle } from "../../components/layout";

export default function Note({ noteData }) {
  return (
    <Layout>
      <Head>
        <title>
          {noteData.title} · {siteTitle}
        </title>
      </Head>

      <article className={utilStyles.article}>
        <header className={utilStyles.articleHeader}>
          <h1 className={utilStyles.articleTitle}>{noteData.title}</h1>
          {noteData.date && (
            <div className={utilStyles.articleMeta}>
              <Date dateString={noteData.date} />
            </div>
          )}
        </header>
        <div
          className={utilStyles.articleBody}
          dangerouslySetInnerHTML={{ __html: noteData.contentHtml }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllNoteIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const noteData = await getNoteData(params.id);
  return {
    props: {
      noteData,
    },
  };
}
