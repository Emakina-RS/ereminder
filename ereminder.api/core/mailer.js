'use strict';
const nodemailer = require('nodemailer');

exports.sendPendingNotifications = function () {
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        let info = await transporter.sendMail({
            from: '"Crvena Linija" <ereminder@example.com>',
            to: 'hari@example.com, djole@example.com', // get user emails from notifications array
            subject: 'Testing eReminder',
            text: 'Please schedule an appointment...',
            html: '<b>Please schedule an appointment...</b>'
        });

        transporter.close();

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);
};