import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faAddressCard,
  faThumbtack,
  faChevronLeft,
  faBars,
  faUsersLine,
  faCalendarDays,
  faCertificate,
  faContactCard,
  faCalendarCheck,
  faGift,
  faIdBadge,
  faExclamation,
  faLaptopCode,
  faCircleInfo,
  faAward,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/sidebar.scss";

const SideBar = ({ isWrap, handleWrap }) => {
  return (
    <aside className={`sidebar ${isWrap ? "wrap" : ""}`}>
      <div className="logo-sidebar">
        {isWrap ? (
          <FontAwesomeIcon onClick={handleWrap} icon={faBars} />
        ) : (
          <FontAwesomeIcon onClick={handleWrap} icon={faChevronLeft} />
        )}
      </div>
      <ul onClick={isWrap ? null : handleWrap}>
        <li>
          <NavLink to={"/home"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faHouse} /> 
            </div> 
              <span>Home</span>
          </NavLink>          
        </li>

        <li>
          <NavLink to={"/benefit"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faGift} />
            </div>
              <span>Benefit</span>          
          </NavLink>
        </li>

        <li>
          <NavLink to={"/trainingprogram"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faCalendarCheck} />{" "}
            </div>
              <span>Training Program</span>      
          </NavLink>
        </li>

        <li>
          <NavLink to={"/event"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faCalendarDays} />{" "}
            </div>
              <span>Event</span>        
          </NavLink>
        </li>

        <li>
          <NavLink to={"/certificatelist"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faAward} />{" "}
            </div>
              <span>Certificate List</span> 
          </NavLink>
        </li>

        <li>
          <NavLink to={"/reference"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faContactCard} />{" "}
            </div>
              <span>Reference</span>
          </NavLink>
        </li>

       
        <li>
          <NavLink to={"/student"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faIdBadge} />{" "}
            </div>
              <span>Student</span>        
          </NavLink>
        </li>
        
        <li>
          <NavLink to={"/companies"}>
            <div className="icon-container">
            <FontAwesomeIcon icon={faBuilding} />{" "}
            </div>
              <span>Companies</span>    
          </NavLink>
        </li>
        
        <li>
          <NavLink to={"/capability"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faLaptopCode} />{" "}
            </div>
              <span>Capability</span>    
          </NavLink>
        </li>

        <li>
          <NavLink to={"/noaccess"}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faExclamation} />{" "}
            </div>
              <span>Access Denied</span>        
          </NavLink>
        </li>    
      </ul>
    </aside>
  );
};

export default SideBar;
