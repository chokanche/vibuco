import React from "react";
import { Container, ContentWithPaddingXl } from "../misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { SectionHeading, Subheading as SubheadingBase } from "../misc/Headings";
import { SectionDescription } from "../misc/Typography";
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

const HeadingContainer = tw.div`text-center`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)``;
const Description = tw(SectionDescription)`mx-auto`;

const Posts = tw.div`mt-12 flex flex-wrap -mr-3 relative`;
const Post = tw.a`flex flex-col h-full bg-gray-200 rounded`;
const PostImage = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 sm:h-80 bg-center bg-cover rounded-t`}
`;
const PostText = tw.div`flex-1 px-6 py-8` 
const PostTitle = tw.h6`font-bold group-hocus:text-green-600 transition duration-300 `;
const PostDescription = tw.p``;
const AuthorInfo = tw.div`flex`;
const AuthorImage = tw.img`w-12 h-12 rounded-full mr-3`;
const AuthorTextInfo = tw.div`text-xs text-gray-600`;
const AuthorName = tw.div`font-semibold mt-2`;
const AuthorProfile = tw.a`pt-1 font-medium`;

const PostContainer = styled.div`
  ${tw`relative z-20 mt-10 sm:pt-3 pr-3 w-full sm:w-1/2 lg:w-1/3 max-w-sm mx-auto sm:max-w-none sm:mx-0`}

  ${props => props.featured && css`
    ${tw`w-full sm:w-full lg:w-2/3`}
    ${Post} {
      ${tw`sm:flex-row items-center sm:pr-3`}
    }
    ${PostImage} {
      ${tw`sm:h-80 sm:min-h-full w-full sm:w-1/2 rounded-t sm:rounded-t-none sm:rounded-l`}
    }
    ${PostText} {
      ${tw`pl-8 pr-5`}
    }
    ${PostTitle} {
      ${tw`text-2xl`}
    }
    ${PostDescription} {
      ${tw`mt-4 text-sm font-semibold text-gray-600 leading-relaxed`}
    }
    ${AuthorInfo} {
      ${tw`mt-8 flex items-center`}
    }
    ${AuthorName} {
      ${tw`mt-0 font-bold text-gray-700 text-sm`}
    }
  `}
`;

const DecoratorBlob1 = tw(SvgDotPatternIcon)`absolute bottom-0 left-0 w-32 h-32 mb-3 ml-3 transform -translate-x-1/2 translate-y-1/2 fill-current text-gray-500 opacity-50`
const DecoratorBlob2 = tw(SvgDotPatternIcon)`absolute top-0 right-0 w-32 h-32 mt-16 mr-6 transform translate-x-1/2 -translate-y-1/2 fill-current text-gray-500 opacity-50`

export default ({
  subheading = "",
  heading = "We love writing.",
  description = "If you would like to read more about powerful questions you can check it on our blog!",
  posts = [
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      authorImageSrc: "../../static/dd-blog.jpg",
      title: "EGO: THE DIFFERENCE BETWEEN A GOOD AND A GREAT LEADER?",
      description:
        "There are many things that can help you become a good leader. And just as many that could drive you to become a great one.",
      authorName: "Dajana Damjanovic",
      authorProfile: "Associate Certified Coach (ACC)",
      profileLink : "https://www.youracclaim.com/badges/3d107ca7-df59-4b9e-81c7-ee8e687dc1f4",
      url: "https://dajanadamjanovic.com/en/ego-the-difference-between-a-good-and-a-great-leader/",
      featured: true
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1494523374364-46c364c83b60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "GRATITUDE AND LEADERSHIP",
      authorName: "Dajana Damjanovic",
      url: "https://dajanadamjanovic.com/en/gratitude-and-leadership/"
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "WORKING WITH REMOTE TEAMS: HOW TO MANAGE DURING DIFFICULT TIMES?",
      authorName: "Dajana Damjanovic",
      url: "https://dajanadamjanovic.com/en/working-with-remote-teams-how-to-manage-during-difficult-times/"
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1531875909331-5c13fb705721?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "SELF-SABOTAGING HABITS: DECIDE TO PUT YOURSELF FIRST AND ACCEPT YOUR IMPERFECTIONS",
      authorName: "Dajana Damjanovic",
      url: "https://dajanadamjanovic.com/en/self-sabotaging-habits-accept-your-imperfections/ "
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1541844053589-346841d0b34c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "THE ROLE OF LEADERS IN MANAGING TEAM DYNAMICS",
      authorName: "Dajana Damjanovic",
      url: "https://dajanadamjanovic.com/en/the-role-of-leaders-in-managing-team-dynamics/"
    }
  ]
}) => {
  return (
    <Container>
      <ContentWithPaddingXl>
        <HeadingContainer>
          {subheading && <Subheading>{subheading}</Subheading>}
          {heading && <Heading>{heading}</Heading>}
          {description && <Description>{description}</Description>}
        </HeadingContainer>
        <Posts>
          {posts.map((post, index) => (
            <PostContainer featured={post.featured} key={index}>
              <Post className="group" href={post.url}>
                <PostImage imageSrc={post.postImageSrc} />
                <PostText>
                  <PostTitle>{post.title}</PostTitle>
                  {post.featured && <PostDescription>{post.description}</PostDescription>}
                  <AuthorInfo>
                    {post.featured && <AuthorImage src={post.authorImageSrc} />}
                    <AuthorTextInfo>
                      <AuthorName>{post.authorName}</AuthorName>
                      {post.featured && <AuthorProfile className="blog" href={post.profileLink}>{post.authorProfile}</AuthorProfile>}
                    </AuthorTextInfo>
                  </AuthorInfo>
                </PostText>
              </Post>
            </PostContainer>
          ))}
          <DecoratorBlob1 />
          <DecoratorBlob2 />
        </Posts>
      </ContentWithPaddingXl>
    </Container>
  );
};
