import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNotificationDashboard } from "../actions";
import Apoteka from "../assets/icon/apoteka.svg";
import Lek from "../assets/icon/lekovi.svg";
import Nalazi from "../assets/icon/nalazi.svg";
import Recepti from "../assets/icon/recepti.svg";
import Uput from "../assets/icon/uputi.svg";
import Checkbox from "../components/Checkbox";
import Radio from "../components/Radio";
import "./NotificationDashboard.css";


const NotificationDashboard = () => {
  const {data,receivedNotification} = useSelector(state => state.notificationDashboard)
  const dispatch = useDispatch();

  useEffect(() => {
    if (!receivedNotification) {
      dispatch(getNotificationDashboard());
    }
  })
  return (
    <div className="Notifications">
      <h1>Želim podsetnik na:</h1>
      <div className="Notifications-grid">
        {Object.keys(data).map((key, index) => {
          let notSec = data[key];
            return (
              <Notificationsection
                key={key}
                icon={NOTIFICATIONS[notSec.notificationTypeDisplay]}
                title={notSec.notificationTypeDisplay}
                options={notSec.intervals} />
            );
          })}
     </div>

      <Link className="Notificationsection-link" to="/calendar">
        Nastavi
      </Link>
    </div>
  )
};

const Notificationsection = ({ icon, title, options }) => (
  <div className="Notificationsection">
    <div className="Notificationsection-heading">
      <div className="Notificationsection-logo-container">
        <img className="Notificationsection-logo" src={icon} alt={icon} />
      </div>
      <div className="Notificationsection-Checkbox">
        <Checkbox text={title} name={title} />
      </div>
    </div>
    <div className="Notificationsection-container">
      {options.map((option, index) => (
        <Radio key={option.id} text={option.displayName} name={title} />
      ))}
    </div>
  </div>
);

const NOTIFICATIONS = {
  Lek: Lek,
  Apoteka: Apoteka,
  Recepti:  Recepti,
  Uput:  Uput,
  Nalazi:  Nalazi
};


export default NotificationDashboard;
