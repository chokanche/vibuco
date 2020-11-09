import React from "react";
import tw from "twin.macro";
import "../../styles/customStyles.css";
import HeaderBase from  './light.js'

const Header = tw(HeaderBase)`max-w-none`;

const ViheaderSimple = () => {
    const navLinks = [ ];
    return (
        <Header className="navpadding" links={navLinks} />
    );
}

export default ViheaderSimple;
