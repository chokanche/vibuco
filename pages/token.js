import React from "react";
import { useRouter } from "next/router";

import { useAuthRedirect } from "aws-cognito-next";
import Layout from "../components/Layout";
import { AUTH_COOKIE_DOMAIN } from "../config";
import Auth from "@aws-amplify/auth";

// When a user comes back from authenticating, the url looks
// like this: /token#id_token=....
// At this point, there will be no cookies yet.
// If we would render any page on the server now,
// it would seem as-if the user is not authenticated yet.
//
// We therefore wait until Amplify has set its cookies.
// It does this automatically because the id_token hash
// is present. Then we redirect the user back to the main page.
// That page can now use SSR as the user will have
// the necessary cookies ready.

export default function Token() {
  const router = useRouter();

  useAuthRedirect(() => {
    router.replace("/");
  });

  return (
    <Layout>
      <p className="my-5 text-center">Loading...</p>
    </Layout>
  );
}
