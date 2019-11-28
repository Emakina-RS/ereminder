import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaskedInput from "react-text-mask";
import { changeDate, createOrUpdateConfiguration, getConfiguration } from "../actions";
import Input from "../components/Input";
import "./Configuration.css";

const dateFormat = {
  inputDateTimeFormat: "YYYY-MM-DD HH:mm",
  outputDateTimeFormat: "DD-MM-YYYY HH:mm:ss",
  inputDateFormat: "YYYY-MM-DD",
  outputDateFormat: "DD-MM-YYYY"
};

const LABEL = {
  LEK: "Datum i vreme kada sam poslednji put popio/la lekove",
  RECEPTI: "Datum kada sam poslednji put podigao/la recepte",
  APOTEKA: "Datum kada sam poslednji put bio/bila u apoteci",
  UPUT: "Datum kada sam poslednji put podigao/la uput",
  NALAZI: "Datum kada sam poslednji put radio/la nalaze"
};

const Configuration = () => {
  const {dates,configurationReceived} = useSelector(state => state.configuration);
  const dispatch = useDispatch();

  useEffect(() => {

    if (!configurationReceived) {
      dispatch(getConfiguration());
    }
  }, [dispatch]);

  const submitConfigurationHandler = () => {
    const lastTimeTookPillsString =
      dates.lastTimeTookPills + " " + dates.lastTimeTookPillsTime;
    const configuration = {
      lastTimeTookPills: moment(
        lastTimeTookPillsString,
        dateFormat.inputDateTimeFormat
      ).format(dateFormat.outputDateTimeFormat),
      lastTimeInPharmacy: moment(
        dates.lastTimeInPharmacy,
        dateFormat.inputDateFormat
      ).format(dateFormat.outputDateFormat),
      lastTimeGotPrescription: moment(
        dates.lastTimeGotPrescription,
        dateFormat.inputDateFormat
      ).format(dateFormat.outputDateFormat),
      lastTimeGotReferral: moment(
        dates.lastTimeGotReferral,
        dateFormat.inputDateFormat
      ).format(dateFormat.outputDateFormat),
      lastTimeExamination: moment(
        dates.lastTimeExamination,
        dateFormat.inputDateFormat
      ).format(dateFormat.outputDateFormat)
    };
    dispatch(createOrUpdateConfiguration(configuration));
  };

  return (
    <div className="NotificationDates">
      <h1>Postavljanje osnovnih parametara</h1>
      <h2>Odaberi datum kada si poslednji put obavio/la određenu aktivnost?</h2>
      <form>
        <div className="NotificationDates-grid">
          <DateSelector
            name="lastTimeTookPills"
            key="lastTimeTookPills"
            selectorType={["date", "time"]}
            label={LABEL.LEK}
            value={[dates.lastTimeTookPills, dates.lastTimeTookPillsTime]}
          />
          <DateSelector
            name="lastTimeGotPrescription"
            key="lastTimeGotPrescription"
            selectorType={["date"]}
            label={LABEL.RECEPTI}
            value={[dates.lastTimeGotPrescription]}
          />
          <DateSelector
            name="lastTimeInPharmacy"
            key="lastTimeInPharmacy"
            selectorType={["date"]}
            label={LABEL.APOTEKA}
            value={[dates.lastTimeInPharmacy]}
          />
          <DateSelector
            name="lastTimeGotReferral"
            key="lastTimeGotReferral"
            selectorType={["date"]}
            label={LABEL.UPUT}
            value={[dates.lastTimeGotReferral]}
          />
          <DateSelector
            name="lastTimeExamination"
            key="lastTimeExamination"
            selectorType={["date"]}
            label={LABEL.NALAZI}
            value={[dates.lastTimeExamination]}
          />
        </div>
        <Link
          onClick={submitConfigurationHandler}
          className="NotificationDate-link"
          to="/calendar"
        >
          Nastavi
        </Link>
      </form>
    </div>
  );
};

const DateSelector = ({ name, selectorType, label, value }) => {
  const customClass =
    selectorType.length !== 1
      ? " DateSelector-picker-date-time"
      : " DateSelector-picker";

  const dispatch = useDispatch();

  const dateSelectionChangedHandler = event => {
    dispatch(changeDate(event.target.value, event.target.name));
  };

  return (
    <div className="DateSelector">
      <h3 className="DateSelector-label">{label}</h3>
      <div className={customClass}>
        {selectorType.map(option => {
          if (option === "date") {
            return (
              <Input
                name={name}
                type={option}
                onChange={dateSelectionChangedHandler}
                value={value[0]}
              />
            );
          } else {
            return (
              <MaskedInput
                name={name + "Time"}
                mask={[/[0-23]/, /\d/, ":", /[0-59]/, /\d/]}
                className="time"
                keepCharPositions={true}
                onChange={dateSelectionChangedHandler}
                placeholder="hh:mm"
                value={value[1]}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Configuration;
