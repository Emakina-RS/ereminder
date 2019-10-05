import React from "react";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import "./Notifications.css";

const Notifications = ({ history }) => (
  <div className="Notifications">
    <h1>Odaberi način podsećanja</h1>
    <NotificationSection title="SMS" />
    <NotificationSection title="Mail" />
    <NotificationSection title="Calendar" />
    <Button
      style={{ marginTop: "60px" }}
      onClick={() => history.push("/calendar")}
    >
      Kreiraj podsetnik
    </Button>
  </div>
);

export const NotificationSection = ({ title }) => (
  <div className="NotificationSection">
    <div className="NotificationSection-logo-container" />
    <div className="NotificationSection-Checkbox">
      <Checkbox />
    </div>
    {title}
  </div>
);

export default Notifications;
