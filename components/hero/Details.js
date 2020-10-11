import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading } from "../misc/Headings.js";
import { SectionDescription } from "../misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { Container, ContentWithVerticalPadding, Content2Xl } from "../misc/Layouts.js";
import { ReactComponent as CheckboxIcon } from "../../static/chck.svg";
import { ReactComponent as QuotesLeftIconBase } from '../../static/l-q.svg'
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/dot-pattern.svg"
import "../../styles/customStyles.css";
const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null


const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)(props => [
  tw`md:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Heading = tw(SectionHeading)`text-left text-vibuco-300 leading-snug xl:text-6xl`;
const Description = tw(SectionDescription)`mt-4 lg:text-base text-gray-700 max-w-md`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-8 inline-block w-56 tracking-wide text-center py-5`;
const FeatureList = tw.ul`mt-12 leading-loose`;
const Feature = tw.li`flex items-center`;
const FeatureIcon = tw(CheckboxIcon)`w-5 h-5 text-primary-500`;
const FeatureText = tw.p`ml-2 font-medium text-gray-700`;
const Image = tw.img`max-w-full w-11/12 rounded-t sm:rounded relative z-20`;
const ImageDecoratorBlob = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none z-10 absolute right-0 bottom-0 transform translate-x-10 translate-y-10 h-32 w-32 opacity-25 text-gray-900 fill-current`}
`;

class Details extends React.Component {
  componentDidMount() {
    new WOW().init()
}
  render() {
    var heading = this.props.heading;
    var description = this.props.description;
    var imageSrc = this.props.imageSrc;
    var imageDecoratorBlob = this.props.imageDecoratorBlob;
    var primaryButtonUrl = this.props.primaryButtonUrl;
    var primaryButtonText = this.props.primaryButtonText;
    var buttonRounded = this.props.buttonRounded;
    var features = this.props.features;
    var animationText = this.props.animationText;
    var animationPhoto = this.props.animationPhoto;
    var animationHeading = this.props.animationHeading;

    const buttonRoundedCss = buttonRounded && tw`rounded-full`;
    return (
        <Container>
          <TwoColumn>
              <TextColumn textOnLeft={true}>
              <div className={animationText} data-wow-duration="2s">
                <TextContent>
                <div className={animationHeading} data-wow-duration="2s" data-wow-delay = "1.5s">
                  <Heading>{heading}</Heading>
                  </div>
                  <Description className="textJustify">{description}</Description>
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
                </TextContent>
              </div>
              </TextColumn>
              <ImageColumn>
              <div className={animationPhoto} data-wow-duration="2s">

                  <Image src={imageSrc} />
                  </div>

              </ImageColumn>
          </TwoColumn>
        </Container>
    );
  }
}

export default Details;
