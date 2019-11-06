const rateLimit = require("express-rate-limit");

/*
** Limits number of requests to 100 from a single IP address in 15 minutes timespan.
*/
exports.NumberOfRequestsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

/*
** Limits too many account creation from a single IP address, in 1h timespan.
*/
exports.AccountCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many accounts created from this IP, please try again after an hour"
    }
});