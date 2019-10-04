import React from "react";
import "./Navbar.css";
import logo from "../assets/icon/logo.svg";

const Navbar = () => (
  <div className="header">
    <img src={logo} className="header-logo" alt="logo" />
    <div className="links">
      <ul>
        <li>
          <a href="">Povratak na sajt</a>
        </li>
        <li>
          <a href="">Izloguj se</a>
        </li>
      </ul>
    </div>
  </div>
);

export default Navbar;
