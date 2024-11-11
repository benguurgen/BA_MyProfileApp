import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/errorpage.scss"
import NoEntryLogo from "../../assets/images/AccessDenied.png"

const AccessErrorPage = () => {

    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/'); 
      };

  return (
    <div className="forbidden-container">
    <img src={NoEntryLogo}/>
    <h1 className="forbidden-title">HALT!</h1>
    <p className="forbidden-message">
      You do not have permission to access this page.
    </p>
    <div className="forbidden-button-container">
      <button className="forbidden-button" onClick={handleGoHome}>Go to Home Page</button>
    </div>
  </div>
  )
}

export default AccessErrorPage