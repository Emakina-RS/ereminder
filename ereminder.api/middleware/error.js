const logger = require("../startup/logger")();

module.exports = function(err, req, res, next) {
  logger.error(`[Middleware:Error] :  ${err.message}. \n ${err.stack}`);
  res.status(500).send("Something failed.");
};
