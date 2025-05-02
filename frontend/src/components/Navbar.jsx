import React, { Fragment } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Fragment>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-links">
          <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>Login</Link>
          <Link to="/signup" className="navbar-button" style={{ textDecoration: 'none', color: 'white' }} >Get Started</Link>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;