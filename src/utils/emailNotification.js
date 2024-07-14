const nodemailer = require('nodemailer');
const logger = require('./logger');
const { EMAIL_USER, EMAIL_PASS } = require('../constant/DB');

const sendEmail = async (to, subject, body) => {
    try {
        // Create a Nodemailer transporter using SMTP or other email service
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or any other email service
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: EMAIL_USER,
            to: to,
            subject: subject,
            text: body,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        logger.info(`Email sent to ${to} with subject: ${subject}`);

        return { message: 'Email sent successfully' };
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        throw new Error('Failed to send email');
    }
};

module.exports = {
    sendEmail
};
