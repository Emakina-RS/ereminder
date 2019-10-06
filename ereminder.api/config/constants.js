'use strict';

const Constants = {
    stringFormats:{
        dateTime:'DD-MM-YYYY HH:mm:ss',
        date:'DD-MM-YYYY'
    },
    errorMessages:{
        requiredField: (fieldName) =>  `${fieldName} is required`,
        invalidDate:'',
        invalidDateTime:'',
        invalidDateTime:'',
        futureDate:'',
        invalidEmail:'',
        missingEmail:'',
        missingPassword:'',
        unmatchedPassword:''
    }
}

const NotificationType = {
    Medicine: 1,
    Recepies: 2,
    Pharmacy: 3,
    Referral: 4,
    MedicalFindings:5
}

const NotificationTypeDictionary = {
    1:"medicine",
    2:"recepies",
    3:"pharmacy",
    4:"referral",
    5:"medicalFindings"
}


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
}

module.exports = Constants;
module.exports.NotificationType = NotificationType;
module.exports.NotificationInterval = NotificationInterval;
module.exports.NotificationTypeDictionary = NotificationTypeDictionary;

