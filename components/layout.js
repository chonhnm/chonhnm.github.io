import Head from "next/head";
import styles from "./layout.module.css";
import Link from "next/link";
import { site } from "../site.config";

export const siteTitle = site.title;

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={site.subtitle} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={styles.header}>
        <div className={styles.siteTitle}>
          <Link href="/">{site.title}</Link>
        </div>
        <nav className={styles.nav}>
          {site.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className={styles.footer}>
        <div>
          © {new Date().getFullYear()} {site.author} · Built with Next.js · Hosted on
          GitHub Pages
        </div>
      </footer>
    </div>
  );
}
