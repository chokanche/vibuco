import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import Landing from "../components/Landing"
import "../styles/landingPageStyles.css";
import Footer from "../components/footers/FiveColumnWithInputForm";
import Features from "../components/features/ThreeColWithSideImage.js";
import Clients from "../components/testimonials/TwoColumnWithImageAndRating"

import FeatureStats from "../components/features/ThreeColCenteredStatsPrimaryBackground";
import Blog from "../components/blogs/GridWithFeaturedPost";
import Pricing from "../components/pricing/ThreePlans.js";
import FAQ from "../components/faqs/SingleCol.js";
import MainFeature from "../components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import Hero from "../components/hero/TwoColumnWithFeaturesAndTestimonial.js";

const HighlightedText = tw.span`text-vibuco-100`

function ScrollToTopOnMount() {
  useEffect(() => {
    // Move to top on rerender
    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual'
  }, []);
  return null;
}

const Index = ({ initialAuth }) => {
  
  // authentication object which represents logged in user
  return (
    <div>
      <ScrollToTopOnMount />
      <Landing />
      <Hero />
      <Features 
        heading={<>Amazing <HighlightedText>Features</HighlightedText></>}
      />
      <MainFeature
        heading={<>Built by <HighlightedText>professional coaches</HighlightedText> and <HighlightedText>their clients</HighlightedText></>}
        description={<>Have you ever thought about what type of questions you ask yourself? Do you know that your skills to lead yourself and lead others depends on the type of questions you use for your inner dialogues and dialogues with others.</>}
      />
      <Clients />
      <Pricing 
        heading={<>Flexible <HighlightedText>Plans</HighlightedText></>}
      />
      <Blog
          subheading="Blog"
          heading={<>We love <HighlightedText>Writing</HighlightedText></>}
        />
      <FAQ
        heading={<>Any <HighlightedText>Questions ?</HighlightedText></>}
      />
      <Footer />
      
    </div>
  );
};

export default Index;
