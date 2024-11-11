import React, { useState, useEffect } from 'react'
import "../../assets/styles/loadingScreen.scss";
import { loadingManager } from './LoadingManager';


const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  

  const show =(message) => {
    setIsLoading(true);
    setMessage(message)
  }

  const hide = () => {
    setIsLoading(false);
    setMessage("");
  }

  useEffect(() => {
    loadingManager.setCallbacks(show, hide);
  }, [show,hide]);

  if (!isLoading) return null;

  return (
    <div className="loading-screen">
    <div className="spinner"></div>
    <p className='loading-message'>{message}</p>
  </div>
    
  )
}

export default LoadingScreen