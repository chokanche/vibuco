import React from "react";
import tw from "twin.macro";
import Viheader from "../components/headers/viheader";
import Footer from "../components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "../components/features/TwoColWithButton.js";
import ThankYou from "../components/misc/ThankYou.js";
import Navbar from "../components/Navbar.js"

const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null
const HighlightedText = tw.span`text-vibuco-100`
const Middle = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center flex-wrap max-w-screen-md justify-between mx-auto`

class About extends React.Component {
  componentDidMount() {
    new WOW().init()
}

  render() {
    return (
      <div className="customFont">
        <Viheader />
      <div className="wow fadeInLeft" data-wow-duration="2s">
        <MainFeature1
          subheading=""
          heading={<><HighlightedText>vibuco</HighlightedText> is more than a digital tool</>}
          description="As a business coach, I am dreaming of transforming my entire coaching practice to virtual. Virtual communication can not maybe replace face to face one but has a great value in it. It allows you to connect, support, and give your services to almost everyone in the World. It opens your door for those who are your true match as clients. 
          We wanted to support all of you eager to do your business online. We offer you a pool of inspirational photos, a pool of powerful questions, and the freedom to use it in combination or not. 
          We give you examples of how photos can be used as a tool for reflection and questions as a tool for leading your conversations effectively.
          To get inspired, to move further to grow we need both, thinking in words and thinking in senses. Using photos you engage not just visual sense but also kinesthetic, and some people can even associate it with smells and sounds. You will allow your clients to get in contact with their emotions and intuition. Photos are powerful metaphors, and with our tool, you can use it without questions giving your client the freedom to choose which photo resonates with them. Using idiosyncratic language and metaphors you can effectively lead your client to the insights they needed to move towards desired actions.
          Vibuco will help you to help your clients shift their perspective and ask themselves the right questions. 
          It is the way and the type of questions we ask ourselves and our clients that will change HOW we lead ourselves and others. 
          Use vibuco to open your virtual conversations, maintain flow in the conversation, support your client if they are stuck in the process, and help them unpack their thoughts."
          buttonRounded={false}
          primaryButtonUrl = "/cards"
          primaryButtonText="Try it out"
          imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
        />
      </div>
      <div className="wow fadeInRight" data-wow-duration="2s">
        <MainFeature1
          subheading=""
          heading={<><HighlightedText>vibuco</HighlightedText> team invites you to participate</>}
          description="We want to provide you not just a digital tool, but a space where you can, together with us, build more digital coaching tools. We wanted to provide you space to use our tool according  to your needs, to add more content in it and  to share it with others.
          We are driven by continuous learning and improvement. Therefore we invite you to share with us your ideas, needs, tools you would like to see transformed to digital.
          Your feedback is more than welcome."
          buttonRounded={false}
          primaryButtonUrl = "/contact"
          primaryButtonText="Share with us"
          imageSrc="https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=768&q=80"
          textOnLeft={false}
        />
      </div>
      <div className="wow fadeIn" data-wow-duration="2s">
        <Middle>
        <ThankYou 
          heading="Thank you note."
          description={<>I would like to thank all those generous photographers who share their photos on website Unsplash, and my partner and his sister for allowing us to use photos created by them.  
            I would like to thank my clients who are my continuous inspiration and discovery of human excellence. 
            Finally, this thank you note would not be complete if I would not mention my coaching mentor, Brankica Ljamic, without whom the power of asking the right questions would never be revealed to me.</>}
          />
        </Middle>

      </div>
      <Footer />
      </div>
    );
  } 
}

export default About;
