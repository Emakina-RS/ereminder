import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import calendar from "../assets/icon/calendar1.svg";
import mail from "../assets/icon/mail1.svg";
import Checkbox from "../components/Checkbox";
import "./Notification.css";
import { getConfiguration, createOrUpdateConfiguration, updateNotificationType } from "../actions";

const Notification = () => {
  const { activeNotifications, configurationReceived } = useSelector(
    state => state.configuration
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!configurationReceived) {
      dispatch(getConfiguration());
    }
  });

  const handleNotificationTypeSelect = (key) => (event) => {
    let checked = event.currentTarget.checked;
    dispatch(updateNotificationType(key, checked));
  }

  const submitNotificationTypeConfig = () => {
    const configuration = {
      enableEmailNotification: activeNotifications.enableEmailNotification,
      enableCalendarNotification: activeNotifications.enableCalendarNotification
    };
    dispatch(createOrUpdateConfiguration(configuration));
  }

  return (
    <div className="NotificationsType">
      <div className="NotificationsType-content">
        <h1>Odaberi način podsećanja</h1>
        <NotificationSection
          title="Email"
          icon={mail}
          checked={activeNotifications.enableEmailNotification}
          onClick={handleNotificationTypeSelect('enableEmailNotification')}
        />
        <NotificationSection
          title="Kalendar"
          icon={calendar}
          checked={activeNotifications.enableCalendarNotification}
          onClick={handleNotificationTypeSelect('enableCalendarNotification')}
        />
        <Link
          className="NotificationsType-link"
          to="/calendar"
          onClick={submitNotificationTypeConfig}
        >
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
