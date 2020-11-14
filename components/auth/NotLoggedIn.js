import React from "react";
import { useAuth } from "../../auth";
import { useEffect } from "react";
import Router from "next/router";

const NotLoggedIn = ({ children }) => {
  const auth = useAuth(null);
  useEffect(() => {
    if (auth) {
      Router.replace("/");
    }
  }, [auth]);

  return children;
};

export default NotLoggedIn;
