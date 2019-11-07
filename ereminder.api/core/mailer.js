'use strict';

const nodemailer = require('nodemailer');
const Email = require('email-templates');
require('../config/config');
const mailSettings = global.globalConfig.mailSettings;

exports.send = async function(templateName, emailProperties, to) {
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

    const email = new Email({
        transport: transporter,
        send: true,
        preview: false,
    });

    await email.send({
        template: templateName,
        message: {
            from: mailSettings.fromEmail,
            to: to
        },
        locals: emailProperties
    });
}