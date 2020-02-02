import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getMonth,
  getYear,
  startOfDay,
  startOfMonth,
  startOfWeek
} from "date-fns";
import React, { useState, useEffect } from "react";
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
import {useDispatch,useSelector} from 'react-redux';
import { getCalendar,calendarChangeMonth, updateCalendar } from './../actions';
import moment from 'moment';
import "./Calendar.css";

const iconsRepresenter = {
  recepti: recepti,
  nalazi: nalazi,
  apoteka: apoteka,
  lekovi: lekovi,
  uputi: uputi
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

const Calendar = () => {
  const dispatch = useDispatch();
  const { calendarData, date } = useSelector(state => state.calendar);
  const configurationDateChange = useSelector(state=> state.configuration.dates);
  
  useEffect(() => {
    dispatch(getCalendar({
      startDate: moment(start).format('YYYY-MM-DD'),
      endDate: moment(end).format('YYYY-MM-DD'),
    }));
  }, [date]);
  
  useEffect(() => {
    dispatch(getCalendar({
      startDate: moment(start).format('YYYY-MM-DD'),
      endDate: moment(end).format('YYYY-MM-DD'),
    }));
  },[configurationDateChange]);

  const { isShowing, toggle } = useModal();
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const endOfFirstWeek = endOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const eachDayOfFirstWeek = eachDayOfInterval({ start, end: endOfFirstWeek });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const eachDay = eachDayOfInterval({ start, end });
  const eachDayNotificationIcon = getIconsFormNotificationType(
    calendarData,
    eachDay
  );
  const pills = takePills(calendarData)

  const legendItems = eachDayNotificationIcon;
  return (
    <div className="Calendar">
      <div className="Calendar-nav">
        <ul className="Calendar-nav-links">
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notifications-dashboard" className="">
              Izmeni notifikacije
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/configuration" className="">
              Izmeni pocetne datume
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notification" className="">
              Izmeni tip
            </Link>
          </li>
        </ul>

        <div className="Calendar-info-links">
          <img src={info} alt="info" className="icon" />
          <button className="info-button" onClick={toggle}>
            Info
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

const takePills = calendarData => {
    if (calendarData && calendarData.takeRecepieEveryHours !== null) {
      return(
      <div className="legend">
        <img className="legend-item" src={lekovi} alt={lekovi} />
        <label className="legend-label">{calendarData.takeRecepieEveryHours} h</label>
      </div>)
    } else {
        return null;
    }
};

const LegendItem = ({ legendDay }) => {
  const date = Object.keys(legendDay)[0];
  const icon = legendDay[Object.keys(legendDay)[0]][0];
  return (
    <div className="legend">
      <img className="legend-item" src={icon} alt={icon} />
      <label className="legend-label">{date}</label>
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
const getIconsFormNotificationType = (calendarData, eachDay) => {
  if (calendarData === null || calendarData === undefined) return [];
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
