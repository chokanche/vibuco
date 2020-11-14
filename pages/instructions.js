import React, { useState, useEffect } from "react";
import Router from "next/router";
import tw from "twin.macro";

import Viheader from "../components/headers/viheader";
import Footer from "../components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "../components/features/TwoCol.js";
import Center from "../components/features/OneCol.js";
import "../styles/customStyles.css";
import { useAuth } from "../auth";
import NotFound from "../pages/msg-notfound";
const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null

const HighlightedText = tw.span`text-vibuco-100`
const Middle = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center flex-wrap max-w-screen-md justify-between mx-auto`


const Instructions = ({ initialAuth }) => {
  const auth = useAuth(initialAuth);
  const [loggedIn, setLoggedIn] = useState(false);

   
  useEffect(() => {
    if (auth) {
      setLoggedIn(true)
      new WOW().init();
    } 
  }, [auth]);

    return (
      <>
        {loggedIn ? (       
          <div className="customFont">
          <Viheader />
          <div className="wow fadeIn" data-wow-duration="4s">
          <MainFeature1
            subheading=""
            heading={<>How can you use  <HighlightedText>vibuco</HighlightedText>?</>}
            description="There are several ways to use vibuco. However, you are more than welcome to use it the way it suits your and your clients’ needs."
            imageSrc= "../static/idea.png"
          />
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
        <div className="wow zoomIn" data-wow-duration="3s">
          <Center
            subheading=""
            heading={<><HighlightedText>vibuco</HighlightedText> exercises</>}
            description=""
          />
        </div>
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="3s">
          <div className="textSizeLarge">1. Make sure that the button <HighlightedText><span className="i">show question</span></HighlightedText> is enabled.</div>
              Show a page with all photos face up and ask your client to pick the one that resonates with them the most.
                When you click on a photo, the photo will enlarge and with a question next to the given photo.
                Ask your client to answer the question, and lead the conversation further.<br/>
                You can ask your client how this question can be related to the scope of your coaching, how they feel about the question, what comes to their mind when they look at the photo etc.<br/>
                When can you use this type of exercise? 
                <ul className="square">
                  <li>When you are on your initial session with a client and you want to initiate a conversation</li>
                  <li>When you are at later stages of the process and you want to support your client to open more</li>
                  <li>When you want to help your client to take a different perspective</li>
                  <li>When you feel that they are stuck with the same idea or the same topic</li>
                  <li>When you find it is difficult for clients to express</li>
                  <li>When you are working with a group and you want to create an atmosphere of sharing </li>
                </ul>
          </Middle>
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="3s">
          <div className="textSizeLarge">2. You have to flip photos face down, by clicking on the button <HighlightedText><span className="i"> flip cards</span></HighlightedText>. 
          Make sure you enable the button <HighlightedText><span className="i">show question</span></HighlightedText>.</div>
          You should ask your client to pick one card randomly by saying the number which they would like to choose. The process goes further as explained under example 1. 
          <br/>
                When can you use this type of exercise? 
                <ul className="square">
                  <li>When you want to prevent the projection of the client influences which photo they will choose</li>
                  <li>When you want more fun and a surprise moment in the exercise</li>
                  <li>When you want your client to select questions that will come to them without the influence of visual</li>
                </ul>
          </Middle>
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="3s">
          <div className="textSizeLarge">3. You have to flip photos face down, by clicking on the button <HighlightedText><span className="i">flip cards </span></HighlightedText>
          and disable the button <HighlightedText><span className="i">show question</span></HighlightedText>.</div>
          In that case, when a client picks up a card, you flip it and you can start with a question: 
          <span className="i center"><br/>“What comes to your mind when you see this photo?”</span><br/>
          After the first answer, you can explore more with your client by asking them open questions and helping them find a connection with their current situation or challenges.
          </Middle>
          
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="3s">
          <div className="textSizeLarge">4. You have to have all your photos in the face-up position and the button <HighlightedText><span className="i">show question</span></HighlightedText> disabled.</div>
                    Show a page with all photos asking your client to pick up a photo that resonates with them the most or with how they feel.
            When you click on the photo, it will enlarge, this time without any question. You can use any type of questions that will help your client express themselves.<br/>
            Some of the questions could be:
                <ul className="square">
                  <li>What do you see when you look at this photo?</li>
                  <li>What was interesting for you in the photo so you decided to pick this one?</li>
                  <li>How is this photo related to you?</li>
                  <li>How does this photo illustrate your current state?</li>
                  <li>How does this photo illustrate how you feel?</li>
                  <li>What comes to your mind now when you look at this photo (a bit longer)?</li>
                  <li>How is this photo related to you?</li>
                </ul>
                <br/>We recommend that you give your client enough time to tap into their impressions before you start a conversation. 
                When can you use this type of exercise?
                <ul className="square">
                  <li>When you want to know what the client would say as a reflection on the photo without giving them any suggestion through a question</li>
                  <li>When you are dealing with emotions in the process or you have a client for whom is difficult to express emotions</li>
                  <li>When you would like to have an icebreaker or an energizer, also when working with a group</li>
                  <li>When you want to use photos to support client to use both sides of their brain - the right (logical) side but also the left (creative) side. 
                    Usually, these types of exercises are used at the beginning of brainstorming activities or workshops. </li>
                </ul>
          </Middle>
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="3s">
          <div className="textSizeLarge">5. You have to have all your photos in the face up position and the button <HighlightedText><span className="i">show question</span></HighlightedText> disabled.</div>
            Before your session choose one photo you would like to use to drive a conversation with your client. You should open that photo to be enlarged before starting your session or sharing your screen with your client.
            Start with the question: <span className="i center">“What do you see in the photo?"</span><br/>
            You listen carefully and you write down for yourself the keywords your client is using. Then you repeat them to your client and ask which word (idea) they would like to explore more. Another option is to ask them which words they choose to use to talk more about it.
            Then repeat the same process several times helping your client spot the keywords they use when expressing their reflection. By that, you give them the power to choose in which direction they would go by choosing the word they want to explore more.
            Idiosyncratic language and metaphors are most effective in the coaching process, and you can use vibuco to do this or similar exercises. 
            The suggestion for this exercise was inspired by professor Tilmans work. 
            For more information check out his work <a className="green" href="https://www.tilman-rentel.de/"> here</a>
            </Middle>
          <Middle className="wow fadeIn textCenter textJustify" data-wow-duration="4s">
            <div className="textSizeLarge">We are sure you can come up with more examples when the photos and questions could be useful for you.</div>
            <br/>
            <div className="textSizeLarge">The logic we followed was to offer you questions that should serve you to build your process of using power questions during your coaching sessions, training, or workshops.</div>
            <br/>
            <div className="textSizeLarge">We also wanted to give you more flexibility so you can use photos without questions.</div>
            <br/>
            <div className="textSizeLarge">We would be more than happy if you would share with us your ideas on how you are using <HighlightedText>vibuco</HighlightedText> and suggestions for improvement. Feel free to <a className= "green" href="/contact">contact us</a>.</div>
          </Middle>
          <br/><br/><br/>
          <Footer />
        </div>
        ) : 
        <NotFound />}
      </>
    );
  } 

export default Instructions;
