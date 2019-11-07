const constants = require("../config/constants");
const moment = require("moment");

exports.convertToUCTDate = date => {
  return moment.utc(date).format(constants.stringFormats.date);
};

exports.convertToUCTDateTime = dateTime => {
  return moment.utc(dateTime).format(constants.stringFormats.dateTime);
};
