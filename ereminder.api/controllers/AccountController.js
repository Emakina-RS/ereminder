'use strict'

const userService = require('../services/userService');

exports.Register = async function(req, res) {
   return await userService.register(req.body)
}

exports.ForgotPassword = async function() {
    //TODO:
}

exports.ResetPassword = async function() {
    //TODO:
}