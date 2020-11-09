import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { SectionHeading, Subheading as SubheadingBase } from "../misc/Headings.js";
import "../../styles/customStyles.css";

const Container = tw.div`relative`;

const TextContent = tw.div`lg:py-2 text-center md:text-center`;
const StatsContainer = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center flex-wrap max-w-screen-md justify-between mx-auto`

const Subheading = tw(SubheadingBase)`text-center md:text-center`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-center leading-tight`;
const Description = tw.div`mt-4 text-center md:text-center text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

export default ({
  subheading = "Our Expertise",
  heading = (
    <>
      Designed & Developed by <span tw="text-primary-500">Professionals.</span>
    </>
  ),
}) => {
  return (
    <Container>
          <TextContent >
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
          </TextContent>
    </Container>
  );
};
