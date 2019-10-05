'use strict'

const util = require('util');
const userService = require('../services/userService');
const authenticationHelper = require('../helpers/authenticationHelper');



exports.Register = async function(req, res) {
    try{
        await userService.register(req.body);
        return res.status(200).json({ message: 'User created' })
    }catch(e){
        return res.status(500).json({ error: 'Internal error' })
    }
}

exports.SetInitConfiguration = async function(req, res) {
    try{
        var currentUserID = authenticationHelper.getUserIdFromRequest(req);
        if(!currentUserID){
            return res.status(401).json({ error: 'Unauthorized' })
        }
        await userService.setInitConfiguration(req.body, currentUserID);

        return res.status(200).json({ message: 'Configuration setup' })
    }catch(e){
        return res.status(500).json({ error: 'Internal error' })
    }
 }

exports.ForgotPassword = async function(req, res) {
    await userService.sendForgotPasswordEmail(req.body.email);

    res.status(200).json({
        message: util.format("If there's an account for %s, an email is sent with a link to reset password.", req.body.email)
    });;
}

exports.ResetPassword = async function() {
    //TODO:
}