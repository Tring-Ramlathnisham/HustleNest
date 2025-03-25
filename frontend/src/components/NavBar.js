import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../assets/Logo1.png";

const Navbar = ({ isLoggedIn, userRole, handleLogout }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}><img src={ logo } alt="HustleNest-Logo"/></div>
      <ul className={styles.navLinks}>
      {!isLoggedIn && <li><Link to="/">Home</Link></li>}
        {/* <li><Link to="/">Home</Link></li> */}
        {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
        {!isLoggedIn && <li><Link to="/register">Signup</Link></li>}
       
        {isLoggedIn && userRole === "client" && (
          <li><Link to="/client/dashboard">Dashboard</Link></li>
        )}
        {isLoggedIn && userRole === "freelancer" && (
          <li><Link to="/freelancer/dashboard">Dashboard</Link></li>
        )}
        {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
        {isLoggedIn && (
          <li className={styles.logout} onClick={handleLogout}>Logout</li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
