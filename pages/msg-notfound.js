import "slick-carousel/slick/slick.css";
import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading, Subheading as SubheadingBase } from "../components/misc/Headings.js";
import { Container, ContentWithPaddingXl } from "../components/misc/Layouts.js";
import SimpleHeader from "../components/headers/headersimple.js"
import _ from "lodash";

const Row = tw.div`flex flex-col md:flex-row justify-between items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 xl:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)(props => [
  tw`md:w-7/12 xl:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:pr-12 lg:pr-16 md:order-first` : tw`md:pl-12 lg:pl-16 md:order-last`
]);

const PUBLIC_FOLDER_PATH = "../static/";

const Image = styled.img(props => [
  props.imageRounded && tw`rounded`,
  props.imageBorder && tw`border`,
  props.imageShadow && tw`shadow`
]);

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-6 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

var imageNames = [
  '404-3.svg','404-4.svg', '404-7.svg', '404-8.svg', '404-9.svg', '404-10.svg', '404-12.svg'
];

export default ({
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  subheading = "",
  heading = "The requested page cannot be found.",
  description = "",
  textOnLeft = false,
}) => {


  const [image, setImage] = useState(null);

  useEffect(() => {
      setImage(PUBLIC_FOLDER_PATH + _.sample(imageNames))
  }, []);

  return (
    <>
    <SimpleHeader />
    <Container>
      <ContentWithPaddingXl>
        <Row>
          <ImageColumn>
            <Image src={image} imageBorder={imageBorder} imageShadow={imageShadow} imageRounded={imageRounded} />
          </ImageColumn>
          <TextColumn textOnLeft={textOnLeft}>
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
          </TextColumn>
        </Row>
      </ContentWithPaddingXl>
    </Container>
    </>
  );
};
