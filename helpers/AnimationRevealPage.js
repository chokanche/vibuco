import React, { useEffect, useRef, useState } from "react";
import tw from "twin.macro";

import { motion } from "framer-motion";

function useInView(offset = 30) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: `0px 0px -${offset}px 0px`,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [offset]);

  return [ref, inView];
}

const StyledDiv = tw.div`font-display min-h-screen text-secondary-500 p-8 overflow-hidden`;
function AnimationReveal({ disabled, children }) {
  if (disabled) {
    return <>{children}</>;
  }

  if (!Array.isArray(children)) children = [children];

  const directions = ["left", "right"];
  const childrenWithAnimation = children.map((child, i) => {
    return (
      <AnimatedSlideInComponent key={i} direction={directions[i % directions.length]}>
        {child}
      </AnimatedSlideInComponent>
    );
  });
  return <>{childrenWithAnimation}</>;
}

function AnimatedSlideInComponent({ direction = "left", offset = 30, children }) {
  const [ref, inView] = useInView(offset);

  const x = { target: "0%" };

  if (direction === "left") x.initial = "-150%";
  else x.initial = "150%";

  return (
    <motion.section
      initial={{ x: x.initial }}
      animate={{ 
        x: inView && x.target,
        transitionEnd:{
          x: inView && 0
        }
      }}
      transition={{ type: "spring", damping: 100 }}
      ref={ref}
    >
      {children}
    </motion.section>
  );
}

export default props => (
  <StyledDiv className="App">
    <AnimationReveal {...props} />
  </StyledDiv>
);
