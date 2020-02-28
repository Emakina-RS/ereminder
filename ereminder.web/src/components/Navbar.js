import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/icon/logo.svg";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const username = useSelector(state => state.login.username);
  const history = useHistory();
  const dispatch = useDispatch();
  const isOnLoginPage = history.location.pathname === "/login";
  const dynamicLinkText = isLoggedIn
    ? `Izloguj se (${username})`
    : isOnLoginPage
    ? "Registruj se"
    : "Uloguj se";

  const dynamicLinkAction = isLoggedIn
    ? () => dispatch({ type: "LOG_OUT" })
    : isOnLoginPage
    ? () => history.push("/register")
    : () => history.push("/login");

  return (
    <div className="Navbar">
      <div className="Navbar-content">
        <Link to="/calendar" className="Navbar-logo">
          <img src={logo} alt="logo" />
        </Link>
        <div className="Navbar-links">
          <ul>
            <li>
              <a href="http://crvenalinija.org/" className="a">
                Povratak na Crvena linija
              </a>
            </li>
            <li>
              <Link onClick={dynamicLinkAction} className="a">
                {dynamicLinkText}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
