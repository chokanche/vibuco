import React, { Component } from 'react';
import { gsap } from 'gsap';
import Viheader from "./headers/viheader"

import "../styles/customStyles.css";

class Landing extends Component {

    componentDidMount(){

        let tl = gsap.timeline({ defaults: { ease: "power1.out" } });
        // I need to stop users from scrolling :)
        tl.set(document.body, {overflow: "hidden"})
        tl.to(".text", { y: "0%", duration: 1, stagger: 0.25 });
        tl.to(".green", { y: "0%", duration: 1, stagger: 0.25 }, '-=1.75');
        tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
        tl.to(".intro", { y: "-100%", duration: 1 }, "-=1");

        tl.fromTo("nav", { opacity: 0 }, { opacity: 1, duration: 1 });

        tl.fromTo(".big-text", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1"); 
        //tl.fromTo(".big-text-bottom", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1"); 

        // Let them scroll again
        tl.set(document.body, {overflow: "auto"})

    }

    render() {
        return (
        <div className="content">
            <main>
                <div className="landingImage">
                    <Viheader/>
                    <h2 className="big-text">Unpack your Thougths</h2>
                </div>
            </main>
            <div className="intro">
                <div className="intro-text">
                    <h1 className="hide">
                    <span className="text"><span className="green">vi</span>rtual</span>
                    </h1>
                    <h1 className="hide">
                    <span className="text"><span className="green">bu</span>siness</span>
                    </h1>
                    <h1 className="hide">
                    <span className="text"><span className="green">co</span>aching</span>
                    </h1>
                </div>
                </div>
                <div className="slider"></div>
            </div>
        );
    }
}

export default Landing;