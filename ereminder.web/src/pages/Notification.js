import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import calendar from "../assets/icon/calendar1.svg";
import mail from "../assets/icon/mail1.svg";
import Checkbox from "../components/Checkbox";
import "./Notification.css";

const Notification = ({ history }) => {
  const { data, receivedNotification } = useSelector(
    state => state.notificationDashboard
  );
  const dispatch = useDispatch();
  return (
    <div className="NotificationsType">
      <div className="NotificationsType-content">
        <h1>Odaberi način podsećanja</h1>
        <NotificationSection title="Mail" icon={mail} />
        <NotificationSection title="Calendar" icon={calendar} />
        <Link className="NotificationsType-link" to="/calendar">
          Kreiraj podsetnik
        </Link>


      </div>
    </div>
  )
};

export const NotificationSection = ({ icon, title }) => (
  <div className="NotificationSection">
    <div className="NotificationSection-logo-container">
      <img className="Notificationsection-logo" src={icon} alt={icon} />
    </div>
    <div className="NotificationSection-Checkbox">
      <Checkbox text={title} name={title} />
    </div>
  </div>
);

export default Notification;
