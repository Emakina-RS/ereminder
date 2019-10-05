'use strict';

const nodemailer = require('nodemailer');
const config = require('../config/config');
const mailSettings = global.globalConfig.mailSettings;

exports.send = async function(subject, body, to) {
    let transporter = nodemailer.createTransport({
        pool: true,
        host: mailSettings.smtp,
        port: mailSettings.port,
        secure: mailSettings.enableSsl,
        auth: {
            user: mailSettings.username,
            pass: mailSettings.password
        }
    });

    await transporter.sendMail({
        from: mailSettings.fromEmail,
        to: to,
        subject: subject,
        html: body
    });
}