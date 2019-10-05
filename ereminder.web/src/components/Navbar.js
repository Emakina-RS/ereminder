import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon/logo.svg";
import "./Navbar.css";

const Navbar = () => (
  <div className="Navbar">
    <div className="Navbar-content">
      <Link to="/calendar" className="Navbar-logo">
        <img src={logo} alt="logo" />
      </Link>
      <div className="Navbar-links">
        <ul>
          <li>
            <Link to="/reminders" className="a">
              Povratak na sajt
            </Link>
          </li>
          <li>
            <Link to="/" className="a">
              Izloguj se
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Navbar;
