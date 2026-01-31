import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { site } from "../../site.config";

export default function Notes() {
  return (
    <Layout>
      <Head>
        <title>{site.notes.title} · {siteTitle}</title>
      </Head>

      <h2 className={utilStyles.headingXl}>{site.notes.title}</h2>
      {site.notes.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </Layout>
  );
}
