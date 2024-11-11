import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import UserDetails from "../UserDetail/UserDetails";
import "../../assets/styles/UserCard.scss";

const UserCard = ({ user, isExpanded, onExpand, onCollapse }) => {
  const { baseUser, candidate, experiences, certificates } = user;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    image,
    address,
  } = baseUser;
  const { workingStatus, applications } = candidate;

  const cardRef = useRef();

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    isExpanded ? onCollapse() : onExpand();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    alert("Delete function is not implemented yet.");
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    alert("Edit function is not implemented yet.");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isExpanded &&
        cardRef.current &&
        !cardRef.current.contains(event.target)
      ) {
        onCollapse();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isExpanded, onCollapse]);

  return (
    <div
      className={`user-card-container ${isExpanded ? "expanded" : ""}`}
      ref={cardRef}
    >
      <div className="user-card-content">
        <div className="user-card-image-container">
          <img className="user-card-image" src={image} alt="User" />
        </div>
        <div className="user-card-body">
          <h2 className="user-card-name">
            {firstName} {lastName}
          </h2>
          <p className="user-card-info">{email}</p>
          <p className="user-card-info">{phoneNumber}</p>
          <p className="user-card-info">{address}</p>
          <p className="user-card-info">
            {new Date(dateOfBirth).toLocaleDateString()} (
            {gender === "Male" ? "Erkek" : "Kadın"})
          </p>
          <p className="user-card-info">
            {workingStatus} ({applications} Applications)
          </p>
        </div>
        {!isExpanded && (
          <>
            {/* <button className="delete" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="edit" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
            </button> */}
            <button className="details" onClick={handleDetailsClick}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </>
        )}
      </div>
      {isExpanded && (
        <UserDetails experiences={experiences} certificates={certificates} />
      )}
    </div>
  );
};

export default UserCard;
