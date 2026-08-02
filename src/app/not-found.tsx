import Link from "next/link";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you requested is unavailable.</p>
      <Link href="/">Return home</Link>
    </section>
  );
}
