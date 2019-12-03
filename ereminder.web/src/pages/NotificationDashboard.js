import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getNotificationDashboard,
  updateNotificationDashboard,
} from "../actions";
import Apoteka from "../assets/icon/apoteka.svg";
import Lek from "../assets/icon/lekovi.svg";
import Nalazi from "../assets/icon/nalazi.svg";
import Recepti from "../assets/icon/recepti.svg";
import Uput from "../assets/icon/uputi.svg";
import Checkbox from "../components/Checkbox";
import Radio from "../components/Radio";
import "./NotificationDashboard.css";

const NotificationDashboard = () => {
  const { data, receivedNotification } = useSelector(
    state => state.notificationDashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!receivedNotification) {
      dispatch(getNotificationDashboard());
    }
  });
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
              options={notSec.intervals}
              notificationTypeId={notSec.notificationTypeId}
              notificationId={notSec.notificationId}
              checked={notSec.checked}
              data={data}
              objectKey={key}
            />
          );
        })}
      </div>

      <Link className="Notificationsection-link" to="/calendar">
        Nastavi
      </Link>
    </div>
  );
};

const Notificationsection = ({
  icon,
  title,
  objectKey,
  data,
  options,
  notificationTypeId,
  notificationId,
  checked
}) => {
  const dispatch = useDispatch();

  const handleNotificationSelect = ({notificationTypeId, data, notificationId}) => (event) => {
    const checked = event.currentTarget.checked;
    const checkedNotification = {
      notificationTypeId: parseInt(notificationTypeId),
      notificationIntervalId: options[0].id,
      notificationId,
    }
    const emptyNotification = {
      notificationId,
    }
    const updatedNotification = checked ? checkedNotification : emptyNotification
    dispatch(updateNotificationDashboard([
      updatedNotification
    ]))
  }
  const handleOptionSelect = ({notificationTypeId, option, title}) => () => {
    dispatch(updateNotificationDashboard([
      {
        notificationTypeId: parseInt(notificationTypeId),
        notificationIntervalId: option.id,
        notificationId,
      }
    ]))
  }
  return (
    <div className="Notificationsection">
      <div className="Notificationsection-heading">
        <div className="Notificationsection-logo-container">
          <img className="Notificationsection-logo" src={icon} alt={icon} />
        </div>
        <div className="Notificationsection-Checkbox">
            <Checkbox
              text={title}
              name={title}
              value={checked}
              onChange={handleNotificationSelect({notificationTypeId, data, notificationId})}
            />
        </div>
      </div>
      <div className="Notificationsection-container">
        {options.map((option, index) => (
          <Radio
            key={option.id}
            text={option.displayName}
            checked={option.checked}
            name={title}
            handleChange={handleOptionSelect({notificationTypeId, option, title})}
          />
        ))}
      </div>
    </div>
  );
}

const NOTIFICATIONS = {
  Lek: Lek,
  Apoteka: Apoteka,
  Recepti: Recepti,
  Uput: Uput,
  Nalazi: Nalazi
};

export default NotificationDashboard;
