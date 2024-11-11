import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../../assets/styles/Home.scss";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SideBarComponent from "../sidebar/SideBarComponent.jsx";

const Home = ({ setIsAuthenticated, page, headerName }) => {
  const [isWrap, setIsWrap] = useState(false);
  
  const handleWrap = () => {
    setIsWrap(!isWrap);
  };

  return (
    <div className="home-container">
      <Navbar setIsAuthenticated={setIsAuthenticated} headerName={headerName} />
      <div className="sidebartable">
        <div className="sidebarcontainer">
          <SideBarComponent setIsWrap={handleWrap} />
        </div>
        <div className="main-layout">
          <main className="content-container">{page}</main>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Home;
