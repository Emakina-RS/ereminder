import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getNotificationDashboard,
  updateNotificationDashboard,
  checkNotificationCheckbox,
  uncheckNotificationCheckbox,
  toggleIntervalSelect,
  fetchRefreshToken
} from "../actions";
import Apoteka from "../assets/icon/apoteka.svg";
import Lek from "../assets/icon/lekovi.svg";
import Nalazi from "../assets/icon/nalazi.svg";
import Recepti from "../assets/icon/recepti.svg";
import Uput from "../assets/icon/uputi.svg";
import Checkbox from "../components/Checkbox";
import Radio from "../components/Radio";
import Button from "../components/Button";
import "./NotificationDashboard.css";

const NotificationDashboard = () => {
  const { data, dashboardLoaded, shouldRedirect } = useSelector(
    state => state.notificationDashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!dashboardLoaded) {
      dispatch(getNotificationDashboard());
    }
  });

  const saveNotificationDashboard = (data) => () => {
    dispatch(updateNotificationDashboard(data));
  }

  // Refresh token or logout user if token has expired
  let auth = useSelector(state => state.auth);
  fetchRefreshToken(auth, dispatch);

  if (shouldRedirect) {
    return <Redirect to="/calendar" />;
  }

  return (
    <div className="Notifications">
      <h1>Želim podsetnik na:</h1>
      <div className="Notifications-grid">
        {Object.keys(data).map((key, index) => {
          let notifSection = data[key];
          return (
            <Notificationsection
              key={key}
              notificationType={key}
              intervals={notifSection.intervals}
              icon={NOTIFICATIONS[notifSection.notificationTypeDisplay]}
              title={notifSection.notificationTypeDisplay}
              checked={notifSection.checked}
              data={data}
            />
          );
        })}
      </div>

      <Button
        className="NotificationsType-link"
        onClick={saveNotificationDashboard(data)}
      >
        Sačuvaj izmene
      </Button>
    </div>
  );
};

const Notificationsection = ({
  notificationType,
  intervals,
  icon,
  title,
  checked,
  data
}) => {
  const configurationDates = useSelector(state => state.configuration.dates);
  const dispatch = useDispatch();

  const handleNotificationSelect = (notificationType) => (event) => {
    let checked = event.currentTarget.checked;
    if (checked) {
      dispatch(checkNotificationCheckbox(notificationType));
      console.log(data);
    }
    else {
      dispatch(uncheckNotificationCheckbox(notificationType));
      console.log(data);
    }
  }

  // check if the intial dates for the given notification are defined in the *Izaberi pocetne datume* menu
  const isNotificationDisabled = (notificationType) => {
	if (!configurationDates || configurationDates === undefined) { 
		return true; 
	}
	
    switch(notificationType) {
      case NOTIFICATION_TYPE.MEDICINE:
        if (!configurationDates['lastTimeTookPills']) {
          return true;
		}
		break;
      case NOTIFICATION_TYPE.RECEPIES:
        if (!configurationDates['lastTimeGotPrescription']) {
		  return true;
		}
		break;
      case NOTIFICATION_TYPE.PHARMACY:
        if(!configurationDates['lastTimeInPharmacy']) {
          return true;
		}
		break;
      case NOTIFICATION_TYPE.REFERRAL:
        if (!configurationDates['lastTimeGotReferral']) {
          return true;
		}
		break;
      case NOTIFICATION_TYPE.MEDICAL_FINDINGS:
        if (!configurationDates['lastTimeExamination']) {
          return true;
		}
		break;
      default:
        return false;
	}
	return false;
  };

  const handleIntervalSelect = (notificationType, intervalIndex) => () => {
    let checkedInterval = {
      notificationType,
      intervalIndex
    }
    dispatch(toggleIntervalSelect(checkedInterval));
  }

  // if all the inital configuration dates are missing, redirect user to the configuration page
  const isConfigurationDatesEmpty = !Object.values(configurationDates).some(x => (x !== undefined && x !== null && x !== ''));
  if(isConfigurationDatesEmpty) {
	return <Redirect to="/configuration" />;
  }

  // if the notification is missing, don`t render Notificationsection (return null if you want to skip rendering)
  if(isNotificationDisabled(notificationType)) {
	  return null;
  }

  // if there is defined intial date for the notification, render it
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
			  onChange={handleNotificationSelect(notificationType)}
            />
        </div>
      </div>
      <div className="Notificationsection-container">
        {intervals.map((interval, index) => (
          <Radio
            key={interval.id}
            text={interval.displayName}
            checked={interval.checked}
            name={title}
            handleChange={handleIntervalSelect(notificationType, index)}
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

const NOTIFICATION_TYPE = {
	MEDICINE: "medicine",
	RECEPIES: "recepies",
	PHARMACY: "pharmacy",
	REFERRAL: "referral",
	MEDICAL_FINDINGS: "medicalFindings"
};

export default NotificationDashboard;
