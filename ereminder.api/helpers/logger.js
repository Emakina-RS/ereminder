'use strict'

const log = require('log-to-file');
const errorsLogFile = 'errors.log';
const infoLogFile = 'info.log';

exports.LogError = function(message) {
    log(message, errorsLogFile);
}

exports.LogInfo = function(message) {
    log(message, infoLogFile);
}