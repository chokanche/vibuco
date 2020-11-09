import "react-medium-image-zoom/dist/styles.css";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import Head from 'next/head'

import {
  USER_POOL_REGION,
  USER_POOL_ID,
  USER_POOL_CLIENT_ID,
  AUTH_COOKIE_DOMAIN,
  NODE_ENV,
  IDP_DOMAIN,
  REDIRECT_SIGN_IN,
  REDIRECT_SIGN_OUT,
} from "../config";
import { GlobalStyles } from "twin.macro";

import "../styles/globalStyles.css";
import "../styles/customStyles.css";

// Configure Amplify with everything it needs to handle authentication
Amplify.configure({
  Auth: {
    region: USER_POOL_REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_CLIENT_ID,

    // Configuration for cookie storage
    // see https://aws-amplify.github.io/docs/js/authentication
    cookieStorage: {
      domain: AUTH_COOKIE_DOMAIN,
      path: "/",
      expires: 7,
      secure: NODE_ENV === "production",
    },
  },
});

// Configure Auth from Amplify with all the information it needs
Auth.configure({
  oauth: {
    domain: IDP_DOMAIN,
    scope: ["email", "openid"],
    // Where users get sent after logging in.
    // This has to be set to be the full URL of the /token page.
    redirectSignIn: REDIRECT_SIGN_IN,
    // Where users are sent after they sign out.
    redirectSignOut: REDIRECT_SIGN_OUT,
    responseType: "token",
  },
});

// Main app component
function MyApp({ Component, pageProps }) {
  return (
    <div className="customFont scrollhost"> 
      <Head>
      <title>vibuco</title>
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
