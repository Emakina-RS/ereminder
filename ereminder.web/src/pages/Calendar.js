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
import { Link } from "react-router-dom";
import dispansery from "../assets/icon/apoteka2.svg";
import edit from "../assets/icon/edit.svg";
import info from "../assets/icon/info.svg";
import { ReactComponent as LeftArrow } from "../assets/icon/left.svg";
import { ReactComponent as RightArrow } from "../assets/icon/right.svg";
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
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const endOfFirstWeek = endOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const eachDayOfFirstWeek = eachDayOfInterval({ start, end: endOfFirstWeek });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const eachDay = eachDayOfInterval({ start, end });
  const legendItems = [
    { type: dispansery, date: "03-10-2019" },
    { type: dispansery, date: "03-10-2019" },
    { type: dispansery, date: "03-10-2019" }
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
          <button
            className="info-button"
            onClick={() => {
              console.log("infoButton");
            }}
          >
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
            console.log(getDay(day));
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
            return <LegendItem lType={lType} />;
          })}
        </div>
      </div>
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

export default Calendar;
