import React from "react";
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter } from "react-icons/fa";
import "../App.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <span>bookshelf@bookshelf.com</span>
          </div>
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>+8801719-109206</span>
          </div>
        </div>
        <div className="social-media">
          <a href="https://www.facebook.com">
            <FaFacebook className="icon" />
          </a>
          <a href="https://www.twitter.com">
            <FaTwitter className="icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
