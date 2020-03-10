import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import {
    changeDate,
    createOrUpdateConfiguration,
    getConfiguration
} from '../actions';
import Input from '../components/Input';
import './Configuration.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const dateFormat = {
    inputDateTimeFormat: 'YYYY-MM-DD HH:mm',
    outputDateTimeFormat: 'DD-MM-YYYY HH:mm:ss',
    inputDateFormat: 'YYYY-MM-DD',
    outputDateFormat: 'DD-MM-YYYY'
};

const LABEL = {
    LEK: 'Datum i vreme kada sam poslednji put popio/la lekove',
    RECEPTI: 'Datum kada sam poslednji put podigao/la recepte',
    APOTEKA: 'Datum kada sam poslednji put bio/bila u apoteci',
    UPUT: 'Datum kada sam poslednji put podigao/la uput',
    NALAZI: 'Datum kada sam poslednji put radio/la nalaze'
};

const Configuration = () => {
    const { dates, configurationReceived } = useSelector(
        state => state.configuration
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (!configurationReceived) {
            dispatch(getConfiguration());
        }
    }, [dispatch]);

    const submitConfigurationHandler = () => {
        const lastTimeTookPillsString =
            dates.lastTimeTookPills + ' ' + dates.lastTimeTookPillsTime;
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
            <h2>
                Odaberi datum kada si poslednji put obavio/la određenu
                aktivnost?
            </h2>
            <form>
                <div className="NotificationDates-grid">
                    <DateSelector
                        name="lastTimeTookPills"
                        key="lastTimeTookPills"
                        selectorType={['date', 'time']}
                        label={LABEL.LEK}
                        value={[
                            dates.lastTimeTookPills,
                            dates.lastTimeTookPillsTime
                        ]}
                    />
                    <DateSelector
                        name="lastTimeGotPrescription"
                        key="lastTimeGotPrescription"
                        selectorType={['date']}
                        label={LABEL.RECEPTI}
                        value={[dates.lastTimeGotPrescription]}
                    />
                    <DateSelector
                        name="lastTimeInPharmacy"
                        key="lastTimeInPharmacy"
                        selectorType={['date']}
                        label={LABEL.APOTEKA}
                        value={[dates.lastTimeInPharmacy]}
                    />
                    <DateSelector
                        name="lastTimeGotReferral"
                        key="lastTimeGotReferral"
                        selectorType={['date']}
                        label={LABEL.UPUT}
                        value={[dates.lastTimeGotReferral]}
                    />
                    <DateSelector
                        name="lastTimeExamination"
                        key="lastTimeExamination"
                        selectorType={['date']}
                        label={LABEL.NALAZI}
                        value={[dates.lastTimeExamination]}
                    />
                </div>
                <Link
                    onClick={submitConfigurationHandler}
                    className="NotificationsType-link"
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
            ? ' DateSelector-picker-date-time'
            : ' DateSelector-picker';

    const dispatch = useDispatch();

    const dateSelectionChangedHandler = (event, modifier, object) => {
        const value = object ? object.input.value : event.target.value;
        const name = object ? object.props.name : event.target.name;
        // data input field validation
        let now = new Date();
        now = now.setHours(0, 0, 0, 0);

        let inputDate = new Date(value);
        inputDate = inputDate.setHours(0, 0, 0, 0);

        if (inputDate <= now) {
            dispatch(changeDate(value, name));
        } else if (name === 'lastTimeTookPillsTime') {
            dispatch(changeDate(value, name));
        }
    };

    const timeMask = value => {
        // time input field validation
        const chars = value.split('');
        const hours = [/[0-2]/, chars[0] === '2' ? /[0-3]/ : /[0-9]/];

        const minutes = [/[0-5]/, /[0-9]/];

        return hours.concat(':').concat(minutes);
    };

    return (
        <div className="DateSelector">
            <h3 className="DateSelector-label">{label}</h3>
            <div className={customClass}>
                {selectorType.map(option => {
                    if (option === 'date') {
                        return (
                            <section>
                                <style>{`
            .DayPickerInput {
              display:block;
            }
            .DayPicker-Month {
              margin: 0;
            }
            .DayPicker-NavButton {
              top: 0.5em;
              right: 1em;
            }
            .DayPicker-Caption {
              display: table-caption;
              background: #333;
              color: #fff;
              padding: 0.5em 1em;
              text-align:center;
            }
            .DayPicker-Day {
              padding: 0.7em;
            }
            .DayPicker-NavButton--prev {
              left: 1em;
            }
            .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
              background-color:#bd1e2c;
            }`}</style>
                                <DayPickerInput
                                    name={name}
                                    type={option}
                                    onDayChange={dateSelectionChangedHandler}
                                    value={value[0]}
                                />
                            </section>
                        );
                    } else {
                        return (
                            <MaskedInput
                                name={name + 'Time'}
                                mask={timeMask}
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
