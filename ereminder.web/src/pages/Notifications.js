import React from "react";
import { Link } from "react-router-dom";
import apoteka from "../assets/icon/apoteka.svg";
import lekovi from "../assets/icon/lekovi.svg";
import nalazi from "../assets/icon/nalazi.svg";
import recepti from "../assets/icon/recepti.svg";
import uputi from "../assets/icon/uputi.svg";
import Checkbox from "../components/Checkbox";
import Radio from "../components/Radio";
import "./Notifications.css";

const Notifications = () => (
  <div className="Notifications">
    <h1>Želim podsetnik na:</h1>
    <div className="Notifications-grid">
      <Notificationsection icon={lekovi} title="Lek" options={["12h", "24h"]} />
      <Notificationsection
        icon={recepti}
        title="Recepti"
        options={[
          "1 mesec",
          "2 meseca",
          "3 meseca",
          "4 meseca",
          "5 meseci",
          "6 meseci"
        ]}
      />
      <Notificationsection
        icon={apoteka}
        title="Apoteka"
        options={["Svaki mesec", "Dva meseca"]}
      />
      <Notificationsection
        icon={uputi}
        title="Uput"
        options={["Svaki 6 meseci"]}
      />
      <Notificationsection
        icon={nalazi}
        title="Nalazi"
        options={["Svakih 12 meseci"]}
      />
    </div>

    <Link className="Notificationsection-link" to="/calendar">
      Nastavi
    </Link>
  </div>
);

const Notificationsection = ({ icon, title, options }) => (
  <div className="Notificationsection">
    <div className="Notificationsection-heading">
      <div className="Notificationsection-logo-container">
        <img className="Notificationsection-logo" src={icon} />
      </div>
      <div className="Notificationsection-Checkbox">
        <Checkbox />
      </div>
      {title}
    </div>
    <div className="Notificationsection-container">
      {options.map((option, index) => (
        <Radio text={option} />
      ))}
    </div>
  </div>
);

export default Notifications;
