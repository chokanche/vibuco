import { useRouter } from "next/router";
import Link from "next/link";
import React, { Children } from "react";
import tw from "twin.macro";


export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-green-500 hocus:text-green-500
`;

const ActiveLink = ({ children, ...props }) => {
  const router = useRouter();
  const child = Children.only(children);
  let className = child.props.className || "";
  const isDynamicRoute = props.href.match(/^\/?\[{1,2}\.{0,3}[a-z]+\]{1,2}$/);

  if (
    router.pathname === props.href &&
    !isDynamicRoute &&
    props.activeClassName
  ) {
    className = `${className} ${props.activeClassName}`.trim();
  } else if (router.asPath === props.as && isDynamicRoute) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  delete props.activeClassName;

  return <NavLink {...props}>{React.cloneElement(child, { className })}</NavLink>;
};

export default ActiveLink;
