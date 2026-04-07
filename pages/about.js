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

      <section className={utilStyles.stack}>
        <span className={utilStyles.eyebrow}>About this site</span>
        <h1 className={utilStyles.headingXl}>{site.about.title}</h1>
        <p className={utilStyles.pageLead}>
          一个使用 Next.js 与 Markdown 构建的个人博客，目标是保持写作体验简单、阅读体验舒适。
        </p>
        {site.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>
    </Layout>
  );
}
