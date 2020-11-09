import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "../misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { ReactComponent as SvgDotPattern } from "../../static/dot-pattern.svg";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";
const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null
const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)(props => [
  tw`md:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.img(props => [
  props.imageRounded && tw`rounded`,
  props.imageBorder && tw`border`,
  props.imageShadow && tw`shadow`,
]);

const DecoratorBlob = tw(
  SvgDotPattern
)`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`;

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.div`mt-8 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Features = tw.div`mx-auto md:mx-0 flex flex-col lg:flex-row max-w-xs lg:max-w-none`;
const Feature = tw.div`mt-10 lg:mt-8 flex items-center md:items-start flex-col md:mr-8 last:mr-0`;

const FeatureHeadingContainer = tw.div`flex items-center`;
const FeatureIconContainer = styled.div`
  ${tw`mx-auto inline-block border border-primary-500 text-primary-500 text-center rounded p-2 flex-shrink-0`}
  ${props => [
    props.iconRoundedFull && tw`rounded-full`,
    props.iconFilled && tw`border-0 bg-primary-500 text-gray-100`
  ]}
  svg {
    ${tw`w-5 h-5`}
  }
`;
const FeatureHeading = tw.div`ml-3 font-bold text-xl`;

const PrimaryButton = styled(PrimaryButtonBase)(props => [
  tw`mt-12 text-sm inline-block mx-auto md:mx-0`,
  props.buttonRounded && tw`rounded-full`
]);

class MainFeatures extends React.Component {

  componentDidMount() {
    new WOW().init()
}

  render() {
    var heading = this.props.heading;
    var description = this.props.description;
    var subheading = this.props.subheading;
    var primaryButtonText = this.props.primaryButtonText;
    var primaryButtonUrl = this.props.primaryButtonUrl;
    var buttonRounded = this.props.buttonRounded;
    var imageSrc = this.props.imageSrc;
    var imageRounded = this.props.imageRounded;
    var imageBorder = this.props.imageBorder;
    var imageShadow = this.props.imageShadow;
    var showDecoratorBlob = this.props.showDecoratorBlob;
    var textOnLeft = this.props.textOnLeft;
    var features = this.props.features;
    var iconRoundedFull = this.props.iconRoundedFull;
    var iconFilled = this.props.iconFilled;
    var animationText = this.props.animationText
    var animationPhoto = this.props.animationPhoto

    return (
      <Container>
      <TwoColumn>
        <ImageColumn>
        <div className={animationPhoto} data-wow-duration="2s">
          <Image src={imageSrc} imageBorder={imageBorder} imageShadow={imageShadow} imageRounded={imageRounded} />
          {showDecoratorBlob && <DecoratorBlob />}
        </div>
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
        <div className={animationText} data-wow-duration="2s">
          <TextContent>
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
            <Description>
              <div className="textJustify">
                {description}
              </div>
              </Description>
            <Description>
              <div className="textJustify">
                {
                  <>Have you thought about what type of questions you ask yourself? 
                  Do you know that successfully leading yourself and others lies in powerful questions you use for your inner dialogues and dialogues with others? Read more on our <a href={primaryButtonUrl} className="blog">blog.</a></>
                }
              </div> 
            </Description>
            <Features>
              {features.map((feature, index) => (
                <Feature key={index}>
                  <FeatureHeadingContainer>
                    <FeatureIconContainer
                      iconFilled={iconFilled}
                      iconRoundedFull={iconRoundedFull}
                      css={feature.iconContainerCss || iconContainerCss}
                    >
                      {<feature.Icon />}
                    </FeatureIconContainer>
                    <FeatureHeading>{feature.title}</FeatureHeading>
                  </FeatureHeadingContainer>
                </Feature>
              ))}
            </Features>
          </TextContent>
          </div>
        </TextColumn>
      </TwoColumn>
    </Container>
    );
  }
}

export default MainFeatures;
