import React from "react";
import "../../assets/styles/UserDetails.scss";

const UserDetails = ({ experiences, certificates }) => {
  return (
    <div className="user-details-container">
      <div className="details-section">
        <h3>Experiences</h3>
        <ul>
          {experiences.map((exp, index) => (
            <li key={index}>
              <p>
                <strong>{exp.companyName}</strong>
              </p>
              <p>
                {new Date(exp.dateOfStart).toLocaleDateString()} -{" "}
                {exp.dateOfEnd
                  ? new Date(exp.dateOfEnd).toLocaleDateString()
                  : "Present"}
              </p>
              <p>{exp.position}</p>
              <p>{exp.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="details-section">
        <h3>Certificates</h3>
        <ul>
          {certificates.map((cert, index) => (
            <li key={index}>
              <p>
                <strong>{cert.name}</strong>
              </p>
              <p>{new Date(cert.certificateDate).toLocaleDateString()}</p>
              <p>{cert.description}</p>
              <p>{cert.achievementStatus ? "Achieved" : "Not Achieved"}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDetails;
