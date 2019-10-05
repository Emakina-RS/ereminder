const express = require('express');
const dbIntializer = require('./dbInitializer');
const app = express();

var server = app.listen(8081, function () {
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", 'dev.ereminder.com', port);
});

dbIntializer.initializeDB(server);