import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import Layout from "../components/Layout";
import Landing from "../components/Landing"
import NewNavbar from "../components/hero/TwoColumnWithFeaturesAndTestimonial";
import "../styles/landingPageStyles.css";
import Footer from "../components/footers/FiveColumnWithInputForm";
import FeatureStats from "../components/features/ThreeColCenteredStatsPrimaryBackground";
import Blog from "../components/blogs/GridWithFeaturedPost";
import Scroll from "../helpers/ScrollIntoView"
const HighlightedText = tw.span`text-green-500`

const Index = ({ initialAuth }) => {
  // authentication object which represents logged in user
  
  return (
    <div>
      <Landing />
        <Blog
          subheading="Blog"
          heading={<>We love <HighlightedText>Writing</HighlightedText></>}
        />
        <Footer />
    </div>
  );
};

export default Index;
