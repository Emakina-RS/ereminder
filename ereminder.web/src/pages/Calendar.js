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

        <span>
          <img src={info} alt="info" className="icon" />
          Info
        </span>
      </div>
      <div className="Calendar-header">
        <LeftArrow
          style={{ height: "30px" }}
          onClick={() => setDate(addMonths(date, -1))}
        />
        <div>{`${dateAsMonthString(date)} ${getYear(date)}`}</div>
        <RightArrow
          style={{ height: "30px" }}
          onClick={() => setDate(addMonths(date, 1))}
        />
      </div>
      <div className="Calendar-main">
        {eachDayOfFirstWeek.map((day, index) => {
          console.log(getDay(day));
          return <div key={index}>{dateAsDayString(day)}</div>;
        })}
        {eachDay.map((day, index) => {
          const inMonth = day.getMonth() === date.getMonth();
          return (
            <div key={index} style={inMonth ? {} : { color: "#adadad" }}>
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
