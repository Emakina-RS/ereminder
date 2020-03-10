import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import calendar from "../assets/icon/calendar1.svg";
import mail from "../assets/icon/mail1.svg";
import Checkbox from "../components/Checkbox";
import "./Notification.css";
import { getConfiguration, createOrUpdateConfiguration } from "../actions";

const Notification = () => {
  const configuration = useSelector(
    state => state.configuration
  );

  const {activeNotifications: {enableCalendarNotification, enableEmailNotification}, configurationReceived} = configuration;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!configurationReceived) {
      dispatch(getConfiguration());
    }
  });

  const handleNotificationTypeSelect = (key) => (event) => {
    dispatch(createOrUpdateConfiguration({
      [key]: event.currentTarget.checked
    }));
  }

  return (
    <div className="NotificationsType">
      <div className="NotificationsType-content">
        <h1>Odaberi način podsećanja</h1>
        <NotificationSection
          title="Mail"
          icon={mail}
          checked={enableEmailNotification}
          onClick={handleNotificationTypeSelect('enableEmailNotification')}
        />
        <NotificationSection
          title="Calendar"
          icon={calendar}
          checked={enableCalendarNotification}
          onClick={handleNotificationTypeSelect('enableCalendarNotification')}
        />
        <Link className="NotificationsType-link" to="/calendar">
          Sačuvaj izmene
        </Link>
      </div>
    </div>
  );
};

export const NotificationSection = ({ icon, title, checked, onClick }) => (
  <div className="NotificationSection">
    <div className="NotificationSection-logo-container">
      <img className="Notificationsection-logo" src={icon} alt={icon} />
    </div>
    <div className="NotificationSection-Checkbox">
      <Checkbox
        text={title}
        name={title}
        value={checked}
        onChange={onClick}
      />
    </div>
  </div>
);

export default Notification;
