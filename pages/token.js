import React from "react";
import { useRouter } from "next/router";
 
// Here we import useAuthRedirect from _auth.tsx, instead
// of from aws-cognito-next.
// We created that file in the previous step.
import { useAuthRedirect } from "./_auth.tsx";
 
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
 
  return <p>loading..</p>;
}