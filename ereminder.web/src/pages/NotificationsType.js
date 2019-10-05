import React from "react";
import calendar from "../assets/icon/calendar1.svg";
import mail from "../assets/icon/mail1.svg";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import "./NotificationsType.css";

const NotificationsType = ({ history }) => (
  <div className="NotificationsType">
    <div className="NotificationsType-content">
      <h1>Odaberi način podsećanja</h1>
      {/* <NotificationSection title="SMS" /> */}
      <NotificationSection title="Mail" icon={mail} />
      <NotificationSection title="Calendar" icon={calendar} />
      <Button
        style={{ marginTop: "60px" }}
        onClick={() => history.push("/calendar")}
      >
        Kreiraj podsetnik
      </Button>
    </div>
  </div>
);

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

export default NotificationsType;
