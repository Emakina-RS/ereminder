import React from "react";
import { Link } from "react-router-dom";

const Reminders = () => (
  <div>
    <h1>Želim podsetnik na:</h1>
    <div>
      <label>
        <input type="checkbox" />
        Lek
      </label>
      <label>
        <input type="radio" name="lek" />
        12h
      </label>
      <label>
        <input type="radio" name="lek" />
        24h
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" />
        Recepti
      </label>
      <label>
        <input type="radio" name="recepti" />1 mesec
      </label>
      <label>
        <input type="radio" name="recepti" />2 meseca
      </label>
      <label>
        <input type="radio" name="recepti" />3 meseca
      </label>
      <label>
        <input type="radio" name="recepti" />4 meseca
      </label>
      <label>
        <input type="radio" name="recepti" />5 meseci
      </label>
      <label>
        <input type="radio" name="recepti" />6 meseci
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" />
        Apoteka
      </label>
      <label>
        <input type="radio" name="apoteka" />
        Svaki mesec
      </label>
      <label>
        <input type="radio" name="apoteka" />
        Dva meseca
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" />
        Uput
      </label>
      <label>
        <input type="radio" name="uput" />
        Svaki 6 meseci
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" />
        Nalazi
      </label>
      <label>
        <input type="radio" name="nalazi" />
        Svakih 12 meseci
      </label>
    </div>
    <Link to="/">Nastavi</Link>
  </div>
);

export default Reminders;
