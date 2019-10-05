'use strict';

const nodemailer = require('nodemailer');
const config = require('../config/config');
const mailSettings = global.globalConfig.mailSettings;

exports.sendPendingNotifications = async function(subject, body, to) {
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

    let info = await transporter.sendMail({
        from: mailSettings.fromEmail,
        to: to,
        subject: subject,
        html: body
    });

    console.log('Message sent: %s', info.messageId);
}