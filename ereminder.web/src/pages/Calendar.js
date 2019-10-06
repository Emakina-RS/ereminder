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
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
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
import "./Calendar.css";

const mapStateToProps = state => ({
  calendarData: state.calendar.data
});

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

const Calendar = ({ calendarData }) => {
  const [date, setDate] = useState(startOfDay(new Date()));
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

  const legendItems = eachDayNotificationIcon;
  return (
    <div className="Calendar">
      <div className="Calendar-nav">
        <ul className="Calendar-nav-links">
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notifications" className="">
              Izmeni notifikacije
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notifications-date" className="">
              Izmeni pocetne datume
            </Link>
          </li>
          <li>
            <img src={edit} alt="edit" className="icon" />
            <Link to="/notifications-type" className="">
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
            onClick={() => setDate(addMonths(date, -1))}
          />
        </div>
        <div className="ch-month">{`${dateAsMonthString(date)} ${getYear(
          date
        )}`}</div>
        <div className="ch-right-arrow">
          <RightArrow
            style={{ height: "30px" }}
            onClick={() => setDate(addMonths(date, 1))}
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
          {legendItems.map((legendDay, index) => {
            return <LegendItem key={index} legendDay={legendDay} />;
          })}
        </div>
      </div>
      <Modal isShowing={isShowing} hide={toggle} />
    </div>
  );
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

const Modal = ({ isShowing, hide }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="Modal-overlay" onClick={hide}>
            <div className="Modal">
              <div className="Modal-container">
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
                <div className="item">
                  <button className="close-button" onClick={hide}>
                    ZATVORI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

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
    if (date in calendarData.reminders) {
      const reminderIconsForDate = calendarData.reminders[date].map(
        reminder => {
          return iconsRepresenter[reminder.notificationTypeName];
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
  for (let c in list) {
    if (calendarDay === Object.keys(list[c])[0]) {
      const arr = list[c][calendarDay].map((icon, index) => {
        return (
          <img className="calendar-icon" src={icon} key={index} alt={icon} />
        );
      });
      return arr;
    }
  }
};

export default connect(mapStateToProps)(Calendar);
