"use strict";

const logger = require("../startup/logger")();
const BadInputError = require("../errors/BadInputError");

module.exports = function(err, req, res, next) {
  logger.error(`[Middleware:Error] :  ${err.message}. \n ${err.stack}`);

  if (err instanceof BadInputError) {
    res.status(400).json({ message: "Invalid input." });
    return;
  }

  res.status(500).json({ message: "Something failed." });
};