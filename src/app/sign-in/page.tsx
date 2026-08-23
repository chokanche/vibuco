import Link from "next/link";

type SignInPageProps = Readonly<{ searchParams: Promise<{ error?: string; signedOut?: string }> }>;

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, signedOut } = await searchParams;
  const message = signedOut ? "You have signed out." : error ? "Sign-in could not be completed. Please try again." : "Sign in to continue.";
  return <section aria-labelledby="sign-in-title"><h1 id="sign-in-title">Sign in</h1><p role="status">{message}</p><Link href="/auth/sign-in">Continue to sign in</Link></section>;
}
