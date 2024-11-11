import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/errorpage.scss"
import PageNotFound from "../../assets/images/PageNotFound.png"

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); 
  };
  return (
    <div className="error-container">
      <img src={PageNotFound}/>
      <h1 className="error-title">Oops! Seems like you got lost.</h1>
      <p className="error-message">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="error-button-container">
        <button className="error-button" onClick={handleGoHome}>Go to Home Page</button>
      </div>
    </div>
  )
}

export default ErrorPage