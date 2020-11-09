import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import Landing from "../components/Landing"
import "../styles/customStyles.css";
import Footer from "../components/footers/FiveColumnWithInputForm";
import Features from "../components/features/ThreeColWithSideImage.js";
import Clients from "../components/testimonials/TwoColumnWithImageAndRating"
import { useAuthFunctions } from "aws-cognito-next";
import { useAuth } from "../auth";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as HeartIcon } from "feather-icons/dist/icons/heart.svg";

import FeatureStats from "../components/features/ThreeColCenteredStatsPrimaryBackground";
import Blog from "../components/blogs/GridWithFeaturedPost";
import Pricing from "../components/pricing/ThreePlans.js";
import FAQ from "../components/faqs/SingleCol.js";
import MainFeatures from "../components/features/MainFeatures.js";
import Details from "../components/hero/Details.js";
import Viheader from "../components/headers/viheader";

const HighlightedText = tw.span`text-vibuco-300`

function ScrollToTopOnMount() {
  useEffect(() => {
    // Move to top on rerender
    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual'
  }, []);
  return null;
}

const Index = ({ initialAuth }) => {
  const auth = useAuth(null);
  const { login, logout } = useAuthFunctions();
  // authentication object which represents logged in user
  return (
    <>
      <ScrollToTopOnMount />
      <Landing />
      <Details 
        heading = "vibuco"
        description = {
          <>
          It is the way and the type of questions we ask that moves us further. We need synchrony between logic and imagination, thinking in words and thinking in senses to produce powerful insight towards a life we want to live. 
          If you are looking for a virtual tool that will help you open and maintain flow in conversations with your clients, then <strong>vibuco</strong> is for you!
          </>
        }
        imageSrc = "../../static/through_the_park.svg"
        imageDecoratorBlob = {true}
        primaryButtonUrl = {login}
        primaryButtonText = "Get access"
        buttonRounded = {true}
        animationHeading = "wow fadeIn"
        animationText = "wow slideInLeft"
        animationPhoto = "wow slideInRight"
        features = {[
        "If  you need to unpack your thoughts.",
        "If you need to help your clients get new ideas, insights or shift in perspective.",
        "If you need to support your clients in unpacking their thoughts.",
        "If you want to use reflection cards, powerful questions, and metaphors."
        ]}
      />
      <Features 
        heading={<><HighlightedText>Features</HighlightedText></>}
        description = ""
        subheading= ""
        animation = "wow slideInLeft"
        cards = {[
          {
            imageSrc: "../../static/camera.svg", 
            title: "Powerful photos",
            description: "We give you a pool of powerfull photos that will provoke your clients’ imagination."
          },
          { imageSrc: "../../static/camera.svg", 
            title: "Powerful questions",
            description: "We prepared a set of powerfull questions you can use in combination with photos to help your client in changing perspective and unpacking their thoughts."
          },
          { imageSrc: "../../static/camera.svg",  
            title: "Intuitive",
            description: "You can use photos face up to let clients’ intuition lead a thinking process or face down to bring a surprise effect in exercise." 
          }]
        }
      />
      <Features 
        heading={<><HighlightedText>- - -</HighlightedText></>}
        description = ""
        subheading = ""
        animation = "wow slideInRight"
        cards = {[
        {
          imageSrc: "../../static/camera.svg", 
          title: "For who?",
          description: "Coaches, trainers, facilitators, you. Those who need to deliver virtually their coaching, workshops, brainstorming sessions, team meetings, training. Those who are looking for inspiration."
        },
        { imageSrc: "../../static/camera.svg", 
          title: "When?",
          description: "Initial coaching sessions, during a coaching process when you or your client feel stuck in it, when they need a new perspective, for brainstorming sessions, workshop openings or closing, as an ice-breaker, as an energizer."
        },
        { imageSrc: "../../static/camera.svg",  
          title: "How?",
          description: "Digital coaching tool, with carefully selected examples of coaching exercises. Available any time during your virtual or face to face session. Available in English and Serbian." 
        }
      ]}
      />
      <MainFeatures
        heading={<>Built by <HighlightedText>professional coaches</HighlightedText> and <HighlightedText>their clients</HighlightedText></>}
        description={<>Inspiration for this tool came from everyday collaborations we have with professional coaches. Partnering our clients on their journey as coaches we continuously learn new powerful questions. This tool would not exist without all those great people.</>}
        subheading = ""
        primaryButtonText = "Read More"
        primaryButtonUrl = "https://dajanadamjanovic.com/en/have-you-mastered-the-art-of-asking-yourself-questions/"
        imageSrc = "../../static/ideas-female.svg"
        buttonRounded = {true}
        imageRounded = {true}
        imageBorder = {false}
        imageShadow = {false}
        showDecoratorBlob = {false}
        textOnLeft = {true}
        animationText = "wow slideInLeft"
        animationPhoto = "wow slideInRight"
        features = {[
          {
            Icon: BriefcaseIcon,
            title: "Intuitive",
            description: "We have the best professional marketing people across the globe just to work with you.",
            iconContainerCss: tw`bg-vibuco-100 text-teal-800`
          },
          {
            Icon: MoneyIcon,
            title: "Affordable",
            description: "We promise to offer you the best rate we can - at par with the industry standard.",
            iconContainerCss: tw`bg-vibuco-100  text-teal-800`
          },
          {
            Icon: HeartIcon,
            title: "Yours",
            description: "We promise to offer you the best rate we can - at par with the industry standard.",
            iconContainerCss: tw`bg-vibuco-100 text-teal-800`
          }
        ]}
        iconRoundedFull = {true}
        iconFilled = {true}
      />
      <Clients 
        heading={<> What would <HighlightedText>others</HighlightedText> say?</>}
        description={<> We asked our partners, colleagues, and friends how they see the importance of questions, reflections, metaphors, and synchronicity between imagination and logic for unpacking our thoughts.</>}
      />
      <Blog
          subheading=""
          heading={<>We love <HighlightedText>Writing</HighlightedText></>}
          description={<>If you would like to read more about topics that bothers all of us who are eager to change and grow - check our blog.</>}
        />
      <Footer />
    </>  
  );
};

export default Index;
