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
import { Link } from "react-router-dom";
import dispansery from "../assets/icon/apoteka2.svg";
import edit from "../assets/icon/edit.svg";
import info from "../assets/icon/info.svg";
import { ReactComponent as LeftArrow } from "../assets/icon/left.svg";
import medicament from "../assets/icon/lekovi2.svg";
import report from "../assets/icon/nalazi2.svg";
import perscription from "../assets/icon/recepti2.svg";
import { ReactComponent as RightArrow } from "../assets/icon/right.svg";
import paper from "../assets/icon/uputi2.svg";
import "./Calendar.css";

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
  const [date, setDate] = useState(startOfDay(new Date()));
  const { isShowing, toggle } = useModal();
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const endOfFirstWeek = endOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const eachDayOfFirstWeek = eachDayOfInterval({ start, end: endOfFirstWeek });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const eachDay = eachDayOfInterval({ start, end });
  const legendItems = [
    { type: dispansery, date: "03-10-2019" },
    { type: paper, date: "03-10-2019" },
    { type: medicament, date: "03-10-2019" }
  ];
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
              </div>
            );
          })}
        </div>
      </div>
      <div className="Calendar-legend">
        <h3>{dateAsMonthString(date)}:</h3>
        <div className="Calendar-legend-list">
          {legendItems.map((lType, index) => {
            return <LegendItem key={index} lType={lType} />;
          })}
        </div>
      </div>
      <Modal isShowing={isShowing} hide={toggle} />
    </div>
  );
};

const LegendItem = ({ lType }) => {
  return (
    <div className="legend">
      <img className="legend-item" src={lType.type} alt={lType.type} />
      <label className="legend-label">{lType.date}</label>
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
                  <img src={medicament} alt={medicament} />
                  <label> = </label>
                  <label> Popij lek</label>
                </div>
                <div className="item">
                  <img src={perscription} alt={perscription} />
                  <label> = </label>
                  <label>Podigni recepte</label>
                </div>
                <div className="item">
                  <img src={dispansery} alt={dispansery} />
                  <label> = </label>
                  <label>Odlazak u apoteku</label>
                </div>
                <div className="item">
                  <img src={paper} alt={paper} />
                  <label> = </label>
                  <label>Podigni upute</label>
                </div>
                <div className="item">
                  <img src={report} alt={report} />
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

export default Calendar;
