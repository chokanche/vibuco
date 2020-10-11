import React, { Component } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro";

import "../../styles/customStyles.css";
import HeaderBase, { NavLinks, NavLink, PrimaryLink } from  './light.js'
const Header = tw(HeaderBase)`max-w-none`;

class Viheader extends Component {
    render(){
        const buttonRoundedCss = tw`rounded-full`;
        const navLinks = [
          <NavLinks key={1}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/cards">Try it out</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </NavLinks>,
          <NavLinks key={2}>
            <NavLink href="/" tw="lg:ml-12!">
              Login
            </NavLink>
            <PrimaryLink css={buttonRoundedCss} href="/">
              Get access
            </PrimaryLink>
          </NavLinks>
        ];
        return (
          <>
            <Header className="customFont navpadding" links={navLinks} />
          </>
        );
    }
}

export default Viheader;
