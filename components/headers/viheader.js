import React, { Component } from "react";
import tw from "twin.macro";
import "../../styles/customStyles.css";
import HeaderBase, { NavLinks, NavLink, NavButton, PrimaryButton, PrimaryLink } from  './light.js'
import { HAS_HOSTED_UI_AUTH_CONFIG } from "../../config";
import { useAuth, useAuthControls } from "../../auth";

import ActiveLink from "../ActiveLink";

const Header = tw(HeaderBase)`max-w-none`;

const Viheader = () => {
    const auth = useAuth(null);
    const { login, logout } = useAuthControls();
    const navLinks = [
      <NavLinks key={1}>
        {!auth ? (
          <> 
            <NavLink href="/">
             Home 
            </NavLink>
            <NavLink href="/cards">
              Try it out
            </NavLink>
          </>
        ) : null}
        {auth ? (
        <>
          <NavLink href="/cards">Cards</NavLink>
          <NavLink href="/instructions">Instructions</NavLink>
        </>
        ) : null}
        <NavLink href="/about">About Us</NavLink>
        <NavLink href="/contact">Contact Us</NavLink>
      </NavLinks>,
      <NavLinks key={2}>
        {!auth && HAS_HOSTED_UI_AUTH_CONFIG ? (
          <PrimaryButton onClick={login} >
          Get access
          </PrimaryButton>
        ) : null}
        {auth ? (
          <NavButton onClick={logout} tw="lg:ml-12!">
            Log out
          </NavButton>
        ) : null}
      </NavLinks>
    ];
    return (
      <>
        <Header className="navpadding" links={navLinks} />
      </>
    );
}

export default Viheader;
