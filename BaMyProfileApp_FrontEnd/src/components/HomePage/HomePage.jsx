import React from "react";
import Charts from "../Charts/Charts"; 
import "../../assets/styles/HomePage.scss";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-charts">
        <Charts />
      </div>
    </div>
  );
};

export default HomePage;
