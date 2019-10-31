const logger = require("../helpers/logger");

module.exports = function(err, req, res, next) {
  logger.LogError(err.message);
  res.status(500).send("Something failed.");
};
