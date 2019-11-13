"use strict";
require("../config/config");
const InvalidResponseObject = require("../errors/InvalidResponseObject");
const request = require('request');
const recaptcha = global.globalConfig.recaptcha;

function verifyScore(response, trustTrashold) {

    if (!response || !response.score) {
        throw InvalidResponseObject("Invalid recaptcha response.");
    }

    if (response.score >= trustTrashold) {
        return { "success" : true };
    }

    return {
        "success": false,
        "message": "Call generated from bot."
    };
}

exports.VerifyRecaptcha = function(req, res) {
    const { token } = req.body;
    
    var verificationUrl = recaptcha.url + '?secret=' + recaptcha.secretKey + '&response=' + token;
    request(verificationUrl,
        { json: true },
        (error, response, body) => {
            if (error) {
                throw error;
            } else {
                return res.json(verifyScore(body, recaptcha.trustTrashold));
            }
        }
    );
};

