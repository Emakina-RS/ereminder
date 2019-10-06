import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MaskedInput from "react-text-mask";
import Input from "../components/Input";
import "./NotificationsDates.css";

const mapStateToProps = state => ({
  configuration: state.configuration.configuration // TODO: Oops!
});

const LABEL = {
  LEK: "Datum i vreme kada sam poslednji put popio/la lekove",
  RECEPTI: "Datum kada sam poslednji put podigao/la recepte",
  APOTEKA: "Datum kada sam poslednji put bio/bila u apoteci",
  UPUT: "Datum kada sam poslednji put podigao/la uput",
  NALAZI: "Datum kada sam poslednji put radio/la nalaze"
};

const NotificationsDates = ({ configuration }) => (
  <div className="NotificationDates">
    <h1>Postavljanje osnovnih parametara</h1>
    <h2>Odaberi datum kada si poslednji put obavio/la određenu aktivnost?</h2>
    <div className="NotificationDates-grid">
      <DateSelector selectorType={["date", "time"]} label={LABEL.LEK} />
      <DateSelector
        selectorType={["date"]}
        label={LABEL.RECEPTI}
        value={configuration.lastTimeGotPrescription}
      />
      <DateSelector
        selectorType={["date"]}
        label={LABEL.APOTEKA}
        value={configuration.lastTimeInPharmacy}
      />
      <DateSelector
        selectorType={["date"]}
        label={LABEL.UPUT}
        value={configuration.lastTimeGotReferral}
      />
      <DateSelector
        selectorType={["date"]}
        label={LABEL.NALAZI}
        value={configuration.lastTimeExamination}
      />
    </div>
    <Link className="NotificationDate-link" to="/calendar">
      Nastavi
    </Link>
  </div>
);

const DateSelector = ({ selectorType, label, value }) => {
  const [initialValue, setInitialValue] = useState(value);
  const customClass =
    selectorType.length !== 1
      ? " DateSelector-picker-date-time"
      : " DateSelector-picker";

  if (selectorType.time === true) {
  }

  return (
    <div className="DateSelector">
      <h3 className="DateSelector-label">{label}</h3>
      <div className={customClass}>
        {selectorType.map((option, index) => {
          if (option === "date") {
            return (
              <Input
                type={option}
                onChange={event => setInitialValue(event.target.value)}
                value={initialValue}
              />
            );
          } else {
            return (
              <MaskedInput
                mask={[/[1-23]/, /\d/, "-", /[0-59]/, /\d/]}
                className="time"
                keepCharPositions={true}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(NotificationsDates);
