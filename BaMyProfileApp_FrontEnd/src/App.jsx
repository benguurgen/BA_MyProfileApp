import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'; // React Query importları
import LoginForm from "./components/forms/Login/LoginForm";
import Home from "./components/Home/Home";
import HomePage from "./components/HomePage/HomePage";
import TrainingProgram from "./components/TrainingProgram/TrainingProgram";
import Event from "./components/Event/Event";
import CertificateList from "./components/CertificateList/CertificateList";
import Reference from "./components/Reference/Reference";
 
import Capability from "./components/Capability/Capability";
import Benefit from "./components/Benefit/Benefit";
import Student from "./components/Student/Student";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from "./components/Load/LoadingScreen.jsx";
import ErrorPage from "./components/ErrorPages/ErrorPage";
import AccessErrorPage from "./components/ErrorPages/AccessErrorPage";
import { loadingManager } from './components/Load/LoadingManager';
import Companies from "./components/Companies/Companies.jsx";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
 
const queryClient = new QueryClient();
 
function App() {
  const activateLoading = () => {};
  const deactivateLoading = () => {};
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const toastId = useRef(null);
  const [sessionExpired, setSessionExpired] = useState(false);
 
  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    const handleKeyDown = () => resetTimer();
    const handleClick = () => resetTimer();
 
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
 
    setSessionExpired(false);
    loadingManager.setCallbacks(activateLoading, deactivateLoading);
    const token = localStorage.getItem("Token") || sessionStorage.getItem("Token");
 
    if (token) {
      setIsAuthenticated(true);
      resetTimer();
    }
    else {
      navigate("/login");
    }
 
    setIsLoading(false);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      clearTimeout(timeoutRef.current);
      clearInterval(countdownRef.current);
    };
  }, [navigate]);
 
  const handleSessionExpiration = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("Token");
    sessionStorage.removeItem("Token");
    localStorage.setItem("sessionExpiredMessage", "Your session has expired. Please log in again.");
    setSessionExpired(true);
    navigate("/login");
  };
 
  const resetTimer = () => {
    if (sessionExpired) return;
 
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
 
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
 
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
 
    const countdown = 10;
    let timeLeft = countdown;
 
    timeoutRef.current = setTimeout(() => {
      toastId.current = toast.info(`Your session will expire in ${timeLeft} seconds`, {
        autoClose: false,
        closeButton: true,
        onClose: () => {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
        }
      });
 
      countdownRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          clearInterval(countdownRef.current);
          toast.dismiss(toastId.current);
          handleSessionExpiration();
        } else {
          toast.update(toastId.current, {
            render: `Your session will expire in ${timeLeft} seconds`,
          });
        }
      }, 1000);
    }, 5 * 60 * 1000 - countdown * 1000);
  };
 
  if(!isLoading)
    {
      return (
        <QueryClientProvider client={queryClient}> {/* QueryClientProvider ile sarmalıyoruz */}
         {isLoading ? (
      <LoadingScreen />
    ) : (
        <>
        {/* <LoadingScreen /> */}
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <LoginForm setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
   
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <Home setIsAuthenticated={setIsAuthenticated} page={<HomePage />} headerName="Home"/>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
       
            <Route
              path="/trainingprogram"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<TrainingProgram />}
                    headerName="Training Program"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/event"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<Event />}
                    headerName="Event"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/certificatelist"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<CertificateList />}
                    headerName="Certificate List"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/reference"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<Reference />}
                    headerName="Reference"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/capability"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<Capability />}
                    headerName="Capability"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/benefit"
              element={
                isAuthenticated ? (
                  <Home
                    setIsAuthenticated={setIsAuthenticated}
                    page={<Benefit />}
                    headerName="Benefit"
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
   
            <Route
              path="/student"
              element={isAuthenticated
                ? (<Home setIsAuthenticated={setIsAuthenticated} page={<Student />} headerName="Student" />)
                : (<Navigate to="/login" />)
              }
            />
 
           
            <Route
              path="/companies"
             
              element={isAuthenticated
                ? (<Home setIsAuthenticated={setIsAuthenticated} page={<Companies />} headerName="Companies" />)
                : (<Navigate to="/login" />)
              }
            />
           
            <Route
              path="/contact"
              element={isAuthenticated
                ? (<Home setIsAuthenticated={setIsAuthenticated} page={<ContactUs />} headerName="Contact Us" />)
                : (<Navigate to="/login" />)
              }
            />    
 
             <Route
              path="/about-us"
              element={isAuthenticated
                ? (<Home setIsAuthenticated={setIsAuthenticated} page={<AboutUs />} headerName="About Us" />)
                : (<Navigate to="/login" />)
              }
            />  
           
   
   
            <Route
              path="*"
              element={<ErrorPage />}
            />
   
            <Route
              path="/noaccess"
              element={<AccessErrorPage />}
            />
          </Routes>
          <ToastContainer
            position="bottom-right"
            limit={5}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
            theme="light"
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </>
    )}
        </QueryClientProvider>
      );
    }
 
}
export default App;
