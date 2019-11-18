const constants = require("../config/constants");
const moment = require("moment");

exports.convertToUCTDate = date => {
  return moment(date, constants.stringFormats.date).utc().format();
};

exports.convertToUCTDateTime = dateTime => {
  return moment(dateTime, constants.stringFormats.dateTime).utc().format();
};
