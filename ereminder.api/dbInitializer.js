var models = require("./models");
var debug = require("debug")("express-sequelize");
var date = new Date();

exports.initializeDB = function(server) {
  models.sequelize
    .sync()
    .then(function() {
      server.on("error", onError);
      server.on("listening", onListening);
    })
    .then(populateIntervals)
    .then(populateTypes)
    .then(populateDashboard);
};

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

async function populateIntervals() {
  var count = await models.Interval.count();

  if (count === 0) {
    await models.Interval.bulkCreate([
      {
        displayName: "12h",
        valueInHours: 12,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "24h",
        valueInHours: 24,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "1 mesec",
        valueInHours: 730,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "2 meseca",
        valueInHours: 1460,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "3 meseca",
        valueInHours: 2190,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "4 meseca",
        valueInHours: 2920,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "5 meseci",
        valueInHours: 3650,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "6 meseci",
        valueInHours: 4380,
        createdAt: date,
        updatedAt: date
      },
      {
        displayName: "12 meseci",
        valueInHours: 8760,
        createdAt: date,
        updatedAt: date
      }
    ], {returning: true});
  }
}

async function populateTypes() {
  var count = await models.NotificationType.count();

  if (count === 0) {
    await models.NotificationType.bulkCreate([
      { value: "Lek", createdAt: date, updatedAt: date },
      { value: "Recepti", createdAt: date, updatedAt: date },
      { value: "Apoteka", createdAt: date, updatedAt: date },
      { value: "Uput", createdAt: date, updatedAt: date },
      { value: "Nalazi", createdAt: date, updatedAt: date }
    ], { returning: true });
  }
}

async function populateDashboard() {
  let count = await models.Notification.count();

  if (count === 0) {
    models.NotificationType.findByPk(1).then(notificationType => {
      notificationType.setIntervals([1, 2]).then(sc => {
      });
    });

    models.NotificationType.findByPk(2).then(notificationType => {
      notificationType.setIntervals([3, 4, 5, 6, 7, 8]).then(sc => {
      });
    });

    models.NotificationType.findByPk(3).then(notificationType => {
      notificationType.setIntervals([3, 4]).then(sc => {
      });
    });

    models.NotificationType.findByPk(4).then(notificationType => {
      notificationType.setIntervals([8]).then(sc => {
      });
    });

    models.NotificationType.findByPk(5).then(notificationType => {
      notificationType.setIntervals([8]).then(sc => {
      });
    });
  }
}