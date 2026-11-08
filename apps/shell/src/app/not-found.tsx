import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <Link href="/">Return to main site</Link>
    </main>
  );
}
