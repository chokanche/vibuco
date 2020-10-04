import React, { Component } from 'react';
import { gsap } from 'gsap';
import Viheader from "./headers/viheader"

import "../styles/landingPageStyles.css";

class Landing extends Component {

    componentDidMount(){
        let tl = gsap.timeline({ defaults: { ease: "power1.out" } });

        tl.to(".text", { y: "0%", duration: 1, stagger: 0.25 });
        tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
        tl.to(".intro", { y: "-100%", duration: 1 }, "-=1");
        tl.fromTo("nav", { opacity: 0 }, { opacity: 1, duration: 1 });
        tl.fromTo(".big-text", { opacity: 0 }, { opacity: 1, duration: 4 }, "-=1"); 
    }

    render() {
        return (
        <div>
            <main>
                <section className="landingImage">
                <Viheader />
                    <h2 className="big-text">Unpack your Thougths</h2>
                </section>
                </main>
                <div className="intro">
                <div className="intro-text">
                    <h1 className="hide">
                    <span className="text">Accelerate</span>
                    </h1>
                    <h1 className="hide">
                    <span className="text">a change</span>
                    </h1>
                    <h1 className="hide">
                    <span className="text">in perspective.</span>
                    </h1>
                </div>
                </div>
                <div className="slider"></div>
            </div>
        );
    }
}

export default Landing;