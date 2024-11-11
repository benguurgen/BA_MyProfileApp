import React from "react";
import { useEffect } from "react";

const SideBarContent = ({ setIsWrap }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1575) {
        setIsWrap(true);
      } else {
        setIsWrap(false);
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return <div className="side-content"></div>;
};

export default SideBarContent;
