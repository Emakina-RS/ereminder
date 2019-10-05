import React from "react";
import { Link } from "react-router-dom";
import apoteka from "../assets/icon/apoteka.svg";
import lekovi from "../assets/icon/lekovi.svg";
import nalazi from "../assets/icon/nalazi.svg";
import recepti from "../assets/icon/recepti.svg";
import uputi from "../assets/icon/uputi.svg";
import Checkbox from "../components/Checkbox";
import "./Reminders.css";

const Reminders = () => (
  <div>
    <h1>Želim podsetnik na:</h1>
    <ReminderSection icon={lekovi} title="Lek" options={["12h", "24h"]} />
    <ReminderSection
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
    <ReminderSection
      icon={apoteka}
      title="Apoteka"
      options={["Svaki mesec", "Dva meseca"]}
    />
    <ReminderSection icon={uputi} title="Uput" options={["Svaki 6 meseci"]} />
    <ReminderSection
      icon={nalazi}
      title="Nalazi"
      options={["Svakih 12 meseci"]}
    />
    <Link to="/">Nastavi</Link>
  </div>
);

const ReminderSection = ({ icon, title, options }) => (
  <div className="ReminderSection">
    <div className="ReminderSection-heading">
      <img
        src={icon}
        style={{
          backgroundColor: "#bc1e2d",
          height: "60px",
          width: "60px"
        }}
      />
      <div className="ReminderSection-Checkbox">
        <Checkbox />
      </div>
      {title}
    </div>
    {options.map((option, index) => (
      <label key={index}>
        <input type="radio" name={title} />
        {option}
      </label>
    ))}
  </div>
);

export default Reminders;
