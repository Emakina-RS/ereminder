"use strict";

const Constants = {
  stringFormats: {
    dateTime: "DD-MM-YYYY HH:mm:ss",
    date: "DD-MM-YYYY"
  },
  errorMessages: {
    requiredField: fieldName => `${fieldName} is required`,
    invalidDate: "",
    invalidDateTime: "",
    invalidDateTime: "",
    futureDate: "",
    invalidEmail: "",
    missingEmail: "",
    missingPassword: "",
    unmatchedPassword: ""
  },
  emailTemplates: {
    confirmRegistration: "confirmRegistration",
    resetPassword: "resetPassword",
    medicineEmail: "medicineEmail",
    recepieEmail: "recepieEmail",
    pharmacyEmail: "pharmacyEmail",
    referralEmail: "referralEmail",
    medicalFindingsEmail: "medicalFindingsEmail"
  },
  errorDataTime: {
    dataTimeInFuture: "Input date is in the future."
  },
  invalidFieldValue: {
    notBooleanField: "This value must be a boolean value.",
    notNumberField: "This value must be a number value."
  },
  passwordError: {
    tooShort: "Password is too short."
  }
};

const NotificationType = {
  Medicine: 1,
  Recepies: 2,
  Pharmacy: 3,
  Referral: 4,
  MedicalFindings: 5
};

const NotificationTypeDictionary = {
  1: "medicine",
  2: "recepies",
  3: "pharmacy",
  4: "referral",
  5: "medicalFindings"
};


const NotificationsCalendarTitles = {
  1: "Reminder for medicine",
  2: "Reminder for recepies",
  3: "Reminder for pharmacy",
  4: "Reminder for referral",
  5: "Reminder for medical findings"
};


const NotificationInterval = {
  TwelveHours: 1,
  TwentyFourHours: 2,
  OneMonth: 3,
  TwoMonths: 4,
  ThreeMonths: 5,
  FourMonths: 6,
  FiveMonths: 7,
  SixMonths: 8,
  TwelveMonths: 9
};

const NotificationIntervalRRULE = {
  1: "RRULE:FREQ=HOURLY;INTERVAL=12",
  2: "RRULE:FREQ=HOURLY;INTERVAL=24",
  3: "RRULE:FREQ=MONTHLY",
  4: "RRULE:FREQ=MONTHLY;INTERVAL=2",
  5: "RRULE:FREQ=MONTHLY;INTERVAL=3",
  6: "RRULE:FREQ=MONTHLY;INTERVAL=4",
  7: "RRULE:FREQ=MONTHLY;INTERVAL=5",
  8: "RRULE:FREQ=MONTHLY;INTERVAL=6",
  9: "RRULE:FREQ=YEARLY"
};

const NotificationIntervalRepeating = {
  1: { freq: 'HOURLY', interval:12},
  2: { freq: 'HOURLY', interval:24},
  3: { freq: 'MONTHLY'},
  4: { freq: 'MONTHLY', interval:2},
  5: { freq: 'MONTHLY', interval:3},
  6: { freq: 'MONTHLY', interval:4},
  7: { freq: 'MONTHLY', interval:5},
  8: { freq: 'MONTHLY', interval:6},
  9: { freq: 'YEARLY'}
};


module.exports = Constants;
module.exports.NotificationType = NotificationType;
module.exports.NotificationInterval = NotificationInterval;
module.exports.NotificationTypeDictionary = NotificationTypeDictionary;
module.exports.NotificationIntervalRepeating = NotificationIntervalRepeating;
module.exports.NotificationsCalendarTitles = NotificationsCalendarTitles;