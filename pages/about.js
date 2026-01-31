import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { site } from "../site.config";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>{site.about.title} · {siteTitle}</title>
      </Head>

      <h2 className={utilStyles.headingXl}>{site.about.title}</h2>
      {site.about.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </Layout>
  );
}
