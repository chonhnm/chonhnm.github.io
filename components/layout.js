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
        <nav aria-label="Primary" className={styles.nav}>
          <ul className={styles.navList}>
            {site.nav?.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
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
