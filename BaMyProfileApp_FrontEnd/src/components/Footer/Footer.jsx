import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';
import "../../assets/styles/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
        <h3><Link to="/contact" style={{ fontSize: '0.95rem'}}>Contact Us</Link></h3>

        </div>
        <div className="footer-section">
          <h3><Link to="/about-us" style={{ fontSize: '0.95rem'}}>About Us</Link></h3>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a
              href="https://tr-tr.facebook.com/bilgeadam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://x.com/bilgeadam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href="https://www.instagram.com/bilgeadam_teknoloji/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.youtube.com/@BilgeAdam_Akademi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 All rights reserved by Bilgeadam</p>
      </div>
    </footer>
  );
};

export default Footer;
