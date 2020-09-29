import { useState, useEffect } from "react";

const useViewport = () => {
  const [vw, setVw] = useState(window && window.innerWidth);
  const [vh, setVh] = useState(window && window.innerHeight);

  const refresh = () => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);
  };

  useEffect(() => {
    // set the vw with the current window viewport width
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return { vw, vh };
};

export default useViewport;
