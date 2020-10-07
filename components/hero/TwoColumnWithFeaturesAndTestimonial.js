import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, { NavLinks, NavLink, PrimaryLink } from  '../headers/light.js'
import { SectionHeading } from "../misc/Headings.js";
import { SectionDescription } from "../misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { Container, ContentWithVerticalPadding, ContentWithPaddingXl } from "../misc/Layouts.js";
import { ReactComponent as CheckboxIcon } from "../../static/chck.svg";
import { ReactComponent as QuotesLeftIconBase } from '../../static/l-q.svg'
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/dot-pattern.svg"

const Row = tw.div`flex flex-col lg:flex-row justify-between items-center lg:pt-16 max-w-screen-2xl mx-auto sm:px-8`;
const Column = tw.div``;
const TextColumn = tw(Column)`mr-auto lg:mr-0 max-w-lg lg:max-w-xl xl:max-w-2xl`;
const Heading = tw(SectionHeading)`text-left text-vibuco-100 leading-snug xl:text-6xl`;
const Description = tw(SectionDescription)`mt-4 lg:text-base text-gray-700 max-w-md`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-8 inline-block w-56 tracking-wide text-center py-5`;
const FeatureList = tw.ul`mt-12 leading-loose`;
const Feature = tw.li`flex items-center`;
const FeatureIcon = tw(CheckboxIcon)`w-5 h-5 text-primary-500`;
const FeatureText = tw.p`ml-2 font-medium text-gray-700`;
const ImageColumn = tw(Column)`ml-auto lg:mr-0 relative mt-16 lg:mt-0 lg:ml-32`;
const ImageContainer = tw.div`relative z-40 transform xl:-translate-x-24 xl:-translate-y-16`;
const Image = tw.img`max-w-full w-96 rounded-t sm:rounded relative z-20`;
const Offsetbackground = tw.div`absolute inset-0 bg-gray-300 rounded xl:-mb-8`
const ImageDecoratorBlob = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none z-10 absolute right-0 bottom-0 transform translate-x-10 translate-y-10 h-32 w-32 opacity-25 text-gray-900 fill-current`}
`;
const Testimonial = tw.div`max-w-sm rounded-b md:rounded-none relative sm:absolute bottom-0 inset-x-0 z-40 px-8 py-6 sm:px-10 sm:py-4 bg-vibuco-100 text-gray-800 font-medium transform md:-translate-x-32 text-sm leading-none md:-mr-16 xl:mr-0`
const QuotesLeftIcon = tw(QuotesLeftIconBase)`w-16 h-16 md:w-12 md:h-12 absolute top-0 left-0 text-gray-100 md:text-red-500 transform translate-x-1 md:-translate-x-1/2 md:-translate-y-5 opacity-50 md:opacity-100`
const Quote = tw.blockquote``
const CustomerName = tw.p`mt-4 font-bold`
const CustomerCompany = tw.p`mt-1 text-sm text-gray-500`


export default ({
  heading = "Vibuco",
  description = "It is the way and the type of questions we ask ourselves and our clients that will move us further. But we need both sides of our brain, the left - logical one, and the right - creative one, to work in synchrony in order to produce the most powerful insight. An insight we all need sometime to keep us going towards a life we want to live.",  
  imageSrc = "../../static/destination.svg",
  imageDecoratorBlob = true,
  primaryButtonUrl = "https://google.com",
  primaryButtonText = "Get access",
  buttonRounded = true,
  features = ["Do you need to unpack your thoughts?", "Do you need to support your clients unpacking their thoughts?", "Do you use reflection cards, powerful questions and metaphors to help your clients?"],
  testimonial = {
    quote: "The insight that we shift our perspective, that will help us unstuck ourself.",
    customerName: "Dajana Damjanovic",
    customerCompany: "Vibuco Inc."
  }
}) => {
  const buttonRoundedCss = buttonRounded && tw`rounded-full`;
  return (
    <>
      <Container>
        <ContentWithPaddingXl>
          <Row>
            <TextColumn>
              <Heading>{heading}</Heading>
              <Description>{description}</Description>
              <PrimaryButton as="a" href={primaryButtonUrl} css={buttonRoundedCss}>
                {primaryButtonText}
              </PrimaryButton>
              <FeatureList>
                {features.map((feature, index) => (
                  <Feature key={index}>
                    <FeatureIcon />
                    <FeatureText>{feature}</FeatureText>
                  </Feature>
                ))}
              </FeatureList>
            </TextColumn>
            <ImageColumn>
              <ImageContainer>
                <Image src={imageSrc} />
                {imageDecoratorBlob && <ImageDecoratorBlob />}
              </ImageContainer>
              <Offsetbackground />
            </ImageColumn>
          </Row>
        </ContentWithPaddingXl>
      </Container>
    </>
  );
};
