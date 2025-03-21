import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './styles/Navbar.module.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/face-control">Face Control</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
