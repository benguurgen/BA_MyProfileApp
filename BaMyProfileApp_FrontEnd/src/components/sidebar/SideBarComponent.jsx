import React, { useState } from "react";
import SideBar from "./SideBar";
import SideBarContent from "./SideBarContent";

const SideBarComponent = () => {
  const [isWrap, setIsWrap] = useState(true);
  const handleWrap = () => {
    setIsWrap(!isWrap);
  };

  return (
    <div className="side-container">
      <SideBar isWrap={isWrap} handleWrap={handleWrap} />
      <div className={`container-body ${isWrap ? "wrap" : ""}`}>
        <SideBarContent setIsWrap={setIsWrap} />
      </div>
    </div>
  );
};

export default SideBarComponent;
