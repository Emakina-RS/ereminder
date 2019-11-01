const winston = require("winston");

module.exports = function() {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.colorize()
    ),
    transports: [
      new winston.transports.File({
        filename: "ereminder.log",
        level: "info"
      })
    ]
  });
};
