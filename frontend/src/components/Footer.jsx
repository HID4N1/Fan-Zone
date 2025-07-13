import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import icons


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Logo and description */}
        <div className="footer-section logo-desc">
            <div className="logo">
                <img src="/assets/icons/favicon.ico" alt="Logo" />
          </div>
          <p className="description">
            Plateforme de gestion intelligente des abonnements.<br />
            Simplifiez vos opérations, optimisez vos trajets,<br />
            et restez connecté à chaque étape.
          </p>
          <div className="social-icons-grid">
  {/* Facebook */}
  <div className="social-row">
    <a href="https://facebook.com/casatram.officiel" target="_blank" rel="noreferrer">
      <img src="/assets/icons/facebook.png" alt="Facebook" />
    </a>
    <a href="https://facebook.com/casatram.officiel" target="_blank" className="social-link">/Casatramway</a>

    <a href="https://facebook.com/casabusway" target="_blank" rel="noreferrer">
      <img src="/assets/icons/facebook.png" alt="Facebook" />
    </a>
    <a href="https://facebook.com/casabusway" target="_blank" className="social-link">/Casabusway</a>
  </div>

  {/* Instagram */}
  <div className="social-row">
    <a href="https://instagram.com/casatramway" target="_blank" rel="noreferrer">
      <img src="/assets/icons/instagram.png" alt="Instagram" />
    </a>
    <a href="https://instagram.com/casatramway" target="_blank" className="social-link">/Casatramway</a>

    <a href="https://instagram.com/casabusway" target="_blank" rel="noreferrer">
      <img src="/assets/icons/instagram.png" alt="Instagram" />
    </a>
    <a href="https://instagram.com/casabusway" className="social-link">/Casabusway</a>
  </div>

  {/* TikTok */}
  <div className="social-row">
    <a href="https://tiktok.com/@casatramway" target="_blank" rel="noreferrer">
      <img src="/assets/icons/tiktok.png" alt="TikTok" />
    </a>
    <a href="https://tiktok.com/@casatramway" target="_blank" className="social-link">/casatramway</a>
  </div>

  {/* YouTube */}
  <div className="social-row">
    <a href="https://youtube.com/casatramway" target="_blank" rel="noreferrer">
      <img src="/assets/icons/youtube.png" alt="YouTube" />
    </a>
    <a href="https://youtube.com/casatramway" target="_blank" className="social-link">/Casatramway</a>
  </div>
</div>

        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li>Fonctionnalite</li>
            <li>Tickets</li>
            <li>A propos</li>
            <li>Carte Reseau</li>
            <li>Casa Art Way</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Ai assistant</li>
            <li>Contact US</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Contact us */}
        <div className="footer-section contact">
          <h3>Contactez nous</h3>
          <input type="email" placeholder="Enter your email" />
          <button>Abonnez-vous à notre newsletter</button>
          <p>Du lundi au samedi de 8h à 20h</p>
          <p>
            Via <a href="#">ce formulaire</a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
  <span>
    <FontAwesomeIcon icon={faCopyright} /> 2025 RATP DEV. All rights reserved
  </span>
  <span>
    <FontAwesomeIcon icon={faPhone} /> 05 22 99 83 83
  </span>
  <span>
    <FontAwesomeIcon icon={faEnvelope} /> infos.voyageurs@ratpdev.com
  </span>
</div>

    </footer>
  );
};

export default Footer;
