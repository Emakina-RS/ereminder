"use strict";

const logger = require("../startup/logger")();

module.exports = function(err, req, res, next) {
  logger.error(`[Middleware:Error] :  ${err.message}. \n ${err.stack}`);

  //TODO: check the error type, if it's of BadInputError then reteurn 400 (bad request), instead of 500

  res.status(500).json({ message: "Something failed." });
};