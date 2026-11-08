import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <h1 className={styles.header}>page not found</h1>
      <Link href="/" className={styles.link}>
        Return to main site
      </Link>
    </main>
  );
}
