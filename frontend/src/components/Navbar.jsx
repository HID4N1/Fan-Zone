import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
      <img src="/assets/icons/favicon.ico" alt="Logo" className="navbar-logo-img" />
      </div>

      {/* Menu items */}
      <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/Fanzone" onClick={() => setMenuOpen(false)}>Fan zones</Link></li>
        <li><Link to="/About" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to='/Tickets' onClick={() => setMenuOpen(false)}>Ticket & Subscription</Link></li>
        <li><Link to='/contact' onClick={() => setMenuOpen(false)}>Contact us</Link></li>
      </ul>

      <div className='navbar-controls'>
        {/* Language dropdown */}
      <div className="navbar-lang">
        <select>
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="es">ES</option>
        </select>
      </div>
      {/* Hamburger icon */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </div>
      </div>
    </nav>

  );
};

export default Navbar;
