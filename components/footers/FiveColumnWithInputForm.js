import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { useAuthFunctions } from "aws-cognito-next";
import HeaderBase, { NavLinks, NavLink, NavButton, PrimaryButton, PrimaryLink } from  '../headers/light.js'
//import LogoImage from "../../static/logo.svg";
import FacebookIcon from "../../static/facebook-icon.svg";
import TwitterIcon from "../../static/twitter.svg";
import YoutubeIcon from "../../static/youtube-icon.svg";

const Container = tw.div`relative bg-gray-200 text-gray-700 -mb-8 px-8`;

// pt-16 
const Content = tw.div`max-w-screen-xl mx-auto pt-1 pb-8`

const FiveColumns = tw.div`flex flex-wrap justify-between`;

const Column = tw.div`px-4 sm:px-0 sm:w-1/4 md:w-auto mt-12`;
//const Column = tw.div`w-1/2 md:w-1/5 mb-8 md:mb-0 text-sm sm:text-base text-center md:text-left`;

const ColumnHeading = tw.h5`uppercase font-bold`;

const LinkList = tw.ul`mt-6 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = tw.a`border-b-2 border-transparent hocus:border-gray-700 pb-1 transition duration-300`;

const SubscribeNewsletterColumn = tw(Column)`text-center lg:text-left w-full! lg:w-auto! mt-20 lg:mt-12`;
const SubscribeNewsletterContainer = tw.div`max-w-sm mx-auto lg:mx-0 `;
const SubscribeText = tw.p`mt-2 lg:mt-6 text-sm font-medium text-gray-600`;
const SubscribeForm = tw.form`mt-4 lg:mt-6 text-sm sm:flex max-w-xs sm:max-w-none mx-auto sm:mx-0`;
const SubscribeButton = tw(PrimaryButtonBase)`mt-4 sm:mt-0 w-full sm:w-auto rounded sm:rounded-l-none px-8 py-3`;

const Divider = tw.div`my-16 border-b-2 border-gray-300 w-full`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoText = tw.h5`ml-2 text-xl font-black tracking-wider text-gray-800`;

const CopywrightNotice = tw.p`text-center text-sm sm:text-base mt-8 md:mt-0 font-medium text-gray-500`;

const SocialLinksContainer = tw.div`mt-8 md:mt-0 flex`;
const SocialLink = styled.a`
  ${tw`cursor-pointer p-2 rounded-full bg-gray-900 text-gray-100 hover:bg-gray-700 transition duration-300 mr-4 last:mr-0`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

export default () => {
  const { login, logout } =  useAuthFunctions();
  return (
    <Container>
      <Content>
        <FiveColumns>
          <Column>
            <ColumnHeading>Main</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="https://dajanadamjanovic.com/en/#!/blog_en">Blog</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/contact">Support</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/meetus">Meet Us</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Product</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#!s" onClick = {login} >Get Access</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="/about">Learn More</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Legal</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">GDPR</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Privacy Policy</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Terms of Service</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Disclaimer</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <SubscribeNewsletterColumn>
            <SubscribeNewsletterContainer>
              <ColumnHeading>Subscribe to our Newsletter</ColumnHeading>
              <SubscribeText>
                We deliver high quality blog posts written by professionals. And we promise no spam.
              </SubscribeText>
              <SubscribeForm method="get" action="#">
                <SubscribeButton  
                  onClick=  {(e) => {
                    e.preventDefault();
                    window.location.href="https://dajanadamjanovic.us4.list-manage.com/subscribe?u=f67ad67aefed8316a33535fce&id=ff22e4189d" ;
                    }}
                  type="button">
                    Subscribe
                </SubscribeButton>
              </SubscribeForm>
            </SubscribeNewsletterContainer>
          </SubscribeNewsletterColumn>
        </FiveColumns>
        <Divider />
        <ThreeColRow>
          <LogoContainer>
            <LogoText>Vibuco Inc.</LogoText>
          </LogoContainer>
          <CopywrightNotice>&copy; 2020 Vibuco Inc. All Rights Reserved.</CopywrightNotice>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com">
            <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <TwitterIcon />
            </SocialLink>
            <SocialLink href="https://youtube.com">
              <YoutubeIcon />
            </SocialLink>
          </SocialLinksContainer>
        </ThreeColRow>
      </Content>
    </Container>
  );
};
