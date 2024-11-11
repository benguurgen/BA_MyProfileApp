import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/navbar.scss";
import logo from "../../assets/images/logo-copy.png";


const Navbar = ({ setIsAuthenticated, headerName, firstName = "Admin", lastName = "", image }) => {
  const navigate = useNavigate();
  const [showDivs, setShowDivs] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(true);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    sessionStorage.removeItem("Token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDivs = () => {
    setShowDivs((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDivs(false);
      setIsIconVisible(true); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    setIsIconVisible(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-image" />
          My Profile
        </Link>
      </div>
      <div className="headerName">{headerName}</div>
      <div className="navbar-right">
        <div onClick={toggleDivs} className="icon-profile">
          {isIconVisible ? (
            <FontAwesomeIcon icon={faUser} onClick={handleIconClick} />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faUser} className="profile-icon" style={{ fontSize: "20px"}} />
            </div>
          )}
        </div>
        {showDivs && (
  <div
    className="dropdown-container"
    ref={dropdownRef}
  >
    <div style={{ width: "240px", margin: "15px", display: "flex", alignItems: "center" }}>
      <FontAwesomeIcon icon={faUser} className="profile-icon" style={{ fontSize: "20px", marginLeft: "15px", color: "white" }} />
      
      <p style={{ color: "white", margin: "0 15px"}}>{`${firstName} ${lastName}`}</p>
    </div>       
    <div style={{ height: "20px", margin: "5px 10px 0 0"  }} />
    <div style={{ position: "relative", marginTop: "10px" }}>
    <button
    onClick={handleLogout}    
    style={{
      left: "10px",
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
    }}

  >
    Çıkış Yap
  </button>
 
    </div>
  </div>
)}




        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
