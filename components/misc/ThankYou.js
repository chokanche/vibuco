import React from 'react'
import "../../styles/customStyles.css";
import tw from "twin.macro";
import styled, { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "../misc/Layouts.js";
import { Subheading as SubheadingBase } from "../misc/Headings.js";
import { SectionDescription } from "../misc/Typography.js";

const PrimaryBackgroundContainer = tw(Container)`-mx-8 px-8 bg-primary-900 text-gray-100`;
const SectionHeading = tw.div`text-4xl sm:text-5xl font-black tracking-wide text-center`

const HeadingContainer = tw.div``;
const Subheading = tw(SubheadingBase)`text-center text-gray-100 mb-4`;
const Heading = tw(SectionHeading)``;
const Description = tw(SectionDescription)`mx-auto text-center text-gray-300`;

export default ({
    heading = "Frequently Asked Questions",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  }) => {
        return (
            <div className="container">
                <h1>
                    {heading}
                </h1>
                <p>{description}</p>
                <style jsx>{`
                .container {
                    text-align: center;
                }
                p {
                    text-align: justify;
                    text-justify: inter-word;
                    padding: 25px 90px 25px 90px;
                    color : #7c8ba1;
                }
                h1 {
                    font-size: xx-large;
                    color: #000;
                }
                `}</style>
          </div>
            )
    }