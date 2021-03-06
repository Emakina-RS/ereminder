import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, getMonth, getYear, startOfMonth, startOfWeek } from "date-fns";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import apoteka from "../assets/icon/apoteka2.svg";
import edit from "../assets/icon/edit.svg";
import info from "../assets/icon/info.svg";
import { ReactComponent as LeftArrow } from "../assets/icon/left.svg";
import lekovi from "../assets/icon/lekovi2.svg";
import nalazi from "../assets/icon/nalazi2.svg";
import recepti from "../assets/icon/recepti2.svg";
import { ReactComponent as RightArrow } from "../assets/icon/right.svg";
import uputi from "../assets/icon/uputi2.svg";
import Modal from "../components/Modal";
import { calendarChangeMonth, getCalendar } from './../actions';
import "./Calendar.css";

const iconsRepresenter = {
  recepti: recepti,
  nalazi: nalazi,
  apoteka: apoteka,
  lekovi: lekovi,
  uput: uputi
};

const days = {
  0: "NED",
  1: "PON",
  2: "UTO",
  3: "SRE",
  4: "ČET",
  5: "PET",
  6: "SUB"
};

const dateAsDayString = date => days[getDay(date) % 7];

const months = {
  0: "Januar",
  1: "Februar",
  2: "Mart",
  3: "April",
  4: "Maj",
  5: "Jun",
  6: "Jul",
  7: "Avgust",
  8: "Septembar",
  9: "Oktobar",
  10: "Novembar",
  11: "Decembar"
};

const dateAsMonthString = date => months[getMonth(date)];

const Calendar = (props) => {
  const dispatch = useDispatch();
  const { calendarData, date, calendarFileAction } = useSelector(state => state.calendar);
  const configurationDateChange = useSelector(state=> state.configuration.dates);
  const { isShowing, toggle } = useModal();
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const endOfFirstWeek = endOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const eachDayOfFirstWeek = eachDayOfInterval({ start, end: endOfFirstWeek });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const eachDay = eachDayOfInterval({ start, end });
  const eachDayNotificationIcon = getIconsFormNotificationType(
    calendarData,
	eachDay,
	configurationDateChange
  );
  const pills = takePills(calendarData, configurationDateChange);

  useEffect(() => {
    dispatch(getCalendar({
      startDate: moment(start).format('YYYY-MM-DD'),
      endDate: moment(end).format('YYYY-MM-DD'),
      calendarFileAction: calendarFileAction
	}));
	// only download the file if the component is instantiated from the Notification component - *Izmeni nacin podsecanja* menu
	if(!!props.location.fromNotificationComponent) {
		downloadFile(calendarData, 'ereminder-calendar.ics');
	}
  }, [date, configurationDateChange]);

  const legendItems = eachDayNotificationIcon;
  return (
    <div className="Calendar">
      <div className="Calendar-nav">
        <ul className="Calendar-nav-links">
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/configuration" className="">
              Izmeni početne datume
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notifications-dashboard" className="">
              Izmeni podsetnike
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notification" className="">
              Izmeni način podsećanja
            </Link>
          </li>
        </ul>

        <div className="Calendar-info-links">
            <img src={info} alt="info" className="icon" />
            <button className="info-button" onClick={toggle}>
              Legenda
            </button>
        </div>
      </div>
      <div className="Calendar-header">
        <div className="ch-left-arrow">
          <LeftArrow
            style={{ height: "30px" }}
            onClick={() => dispatch(calendarChangeMonth(addMonths(date, -1))) }
          />
        </div>
        <div className="ch-month">{`${dateAsMonthString(date)} ${getYear(
          date
        )}`}</div>
        <div className="ch-right-arrow">
          <RightArrow
            style={{ height: "30px" }}
            onClick={() => dispatch(calendarChangeMonth(addMonths(date, 1))) }
          />
        </div>
      </div>
      <div className="Calendar-main">
        <div className="Calendar-day-of-week">
          {eachDayOfFirstWeek.map((day, index) => {
            return (
              <div className="day-of-week" key={index}>
                {dateAsDayString(day)}
              </div>
            );
          })}
        </div>
        <div className="Calendar-days">
          {eachDay.map((day, index) => {
            const inMonth = day.getMonth() === date.getMonth();

            return (
              <div
                className="day"
                key={index}
                style={inMonth ? {} : { color: "#adadad" }}
              >
                {format(day, "d")}
                <div className="day-icon">
                  {getIconForDay(
                    eachDayNotificationIcon,
                    format(day, "yyyy/MM/dd")
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="Calendar-legend">
        <h3>{dateAsMonthString(date)}:</h3>
        <div className="Calendar-legend-list">
          {pills}
          {legendItems.map((legendDay, index) => {
            return <LegendItem key={index} legendDay={legendDay} />;
          })}
        </div>
      </div>
      <Modal isShowing={isShowing} hide={toggle} content={modalContent()} />
    </div>
  );
};

const takePills = (calendarData, configuration) => {
	let pillsConfigurationExists = isNotificationEnabledBasedOnNotificationTypeID(1, configuration);
    if (calendarData && calendarData.takeRecepieEveryHours != null && !pillsConfigurationExists) {
      return(
      <div className="legend">
        <img className="legend-item" src={lekovi} alt={lekovi} />
        <label className="legend-label">{calendarData.takeRecepieEveryHours} h</label>
      </div>)
    } else {
        return null;
    }
};

const downloadFile = (calendarData, filename) => {
  if (!calendarData || !calendarData.calendarFileData) {
    return;
  }
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/calendar;charset=utf8,' + escape(calendarData.calendarFileData));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

const LegendItem = ({ legendDay }) => {
  const date = Object.keys(legendDay)[0];
  const dateFormat = {
    serverDateFormat: 'YYYY-MM-DD',
    uiDateFormat: 'DD.MM.YYYY'
  };
  const icons = legendDay[Object.keys(legendDay)[0]];
  
  return (
    <div className="legend">
      <div className='legend-items'>
      {icons.map((icon, key)=> {
        return <img className="legend-item" key={key} src={icon} alt={icon} />
      })}
      </div>
      <label className="legend-label">{
        moment(
          date,
          dateFormat.serverDateFormat
        ).format(dateFormat.uiDateFormat)
      }</label>
    </div>
  );
};

const modalContent = () => {
  return (
    <div>
      <h2>Legenda</h2>
      <div className="item">
        <img src={lekovi} alt={lekovi} />
        <label> = </label>
        <label> Popij lek</label>
      </div>
      <div className="item">
        <img src={recepti} alt={recepti} />
        <label> = </label>
        <label>Podigni recepte</label>
      </div>
      <div className="item">
        <img src={apoteka} alt={apoteka} />
        <label> = </label>
        <label>Odlazak u apoteku</label>
      </div>
      <div className="item">
        <img src={uputi} alt={uputi} />
        <label> = </label>
        <label>Podigni upute</label>
      </div>
      <div className="item">
        <img src={nalazi} alt={nalazi} />
        <label> = </label>
        <label>Uradi analize</label>
      </div>
    </div>
  );
}

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  let toggle = () => {
    setIsShowing(!isShowing);
  };
  return { isShowing, toggle };
};

//------------------
// Helpers
//------------------
const getIconsFormNotificationType = (calendarData, eachDay, configurationDateChange) => {
  if (calendarData === null || calendarData === undefined) return [];

  filterReminders(calendarData.reminders, configurationDateChange);

  const notificationIconsByDay = eachDay.map(day => {
    const date = format(day, "yyyy/MM/dd");
    if (calendarData.reminders && date in calendarData.reminders) {
      const reminderIconsForDate = calendarData.reminders[date].map(
        reminder => {
          return iconsRepresenter[reminder.notificationTypeName.toLowerCase()];
        }
      );
      return { [date]: reminderIconsForDate };
    }
  });
  return notificationIconsByDay.filter(obj => {
    if (obj) return true;
    return false;
  });
};

// leave out the reminders which don`t have intiail configuration setup for them
const filterReminders = (reminders, configurationDateChange) => {
	for(const date in reminders) {
		for(var i = reminders[date].length - 1; i >= 0; --i) {
			if(isNotificationEnabledBasedOnNotificationTypeID(reminders[date][i].notificationTypeId, configurationDateChange)) {
				reminders[date].splice(i, 1);
			}
		}
		if(reminders[date].length < 1) {
			delete reminders[date];
		}
	}
}

// based on notification type ID from database check if the configuration exists for the given notification
const isNotificationEnabledBasedOnNotificationTypeID = (notificationTypeID, configuration) => {
	switch(notificationTypeID) {
		case 1:
			if(!configuration['lastTimeTookPills']) {
				return true;
			}
			break;
		case 2:
			if(!configuration['lastTimeGotPrescription']) {
				return true;
			}
			break;
		case 3:
			if(!configuration['lastTimeInPharmacy']) {
				return true;
			}
			break;
		case 4:
			if(!configuration['lastTimeGotReferral']) {
				return true;
			}
			break;
		case 5:
			if(!configuration['lastTimeExamination']) {
				return true;
			}
			break;
		default:
			return false;
		}
		return false;
  };

const getIconForDay = (list, calendarDay) => {
    return list.map((c) => {
      if (calendarDay === `${Object.keys(c)[0]}`) {
        return c[calendarDay].map((icon, index) => {
          return (
            <img className="calendar-icon" src={icon} key={index} alt={icon} />
          );
        });
      }
    })
};

export default Calendar;
