require('dotenv').config();
const cron = require('node-cron');

const TournamentState = require('../models/TournamentState');
const { sendEmail } = require('./emailNotification');
const { default: mongoose } = require('mongoose');
const { EMAIL_SUBJECTS } = require('../constant/emailBody');
const logger = require('./logger');
const connectDB = require('../db');
const { EMAIL_USER } = require('../constant/DB');
console.log("process.env.MONGODB_URI",process.env.MONGODB_URI)

const sendReminderEmails = async () => {
    try {
        // Calculate today's date
        const today = new Date('2024-07-11T14:30:00.000Z');
        // today.setHours(0, 0, 0, 0); // Start of the day

        // Find TournamentStates for today
        const tournamentStates = await TournamentState.find({ date: today })
            .populate('tournamentId', 'name')
            .populate('participants', 'name email')
            .exec();
            logger.info(` tournamentStates ${JSON.stringify(tournamentStates)} `)
        // Iterate through each TournamentState
        for (const state of tournamentStates) {
            const tournamentName = state.tournamentId.name;
            const participantDetails = state.participants.map(participant => ({
                name: participant.name,
                email: participant.email,
            }));
            logger.info(` participantDetails ${JSON.stringify(participantDetails)} `)
            // Send email to each participant
            for (const participant of participantDetails) {
                const mailOptions = {
                    from: EMAIL_USER,
                    to: participant.email,
                    subject: `Tournament Reminder: ${tournamentName}`,
                    text: `Hi ${participant.name},\n\nThis is a reminder for the tournament "${tournamentName}" today. Good luck!\n\nRegards,\nYour Tournament Organizer`,
                };
                logger.info(` email sending to ${JSON.stringify(mailOptions)} `)
        
                await sendEmail(mailOptions.to,mailOptions.subject,mailOptions.text);
                console.log(`Email sent to ${participant.email}`);
            }
        }

        console.log('Emails sent successfully.');
    } catch (error) {
        console.error('Error sending emails:', error);
        throw error;
    }
};

// Optional: Schedule the function to run daily at 7:30 PM
const scheduleReminderEmails = async () => {
    // Schedule cron job to run at 7:30 PM daily
    connectDB().then(async() => {
        await sendReminderEmails();
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
   
    // cron.schedule('30 19 * * *', async () => {
    //     try {
    //         await sendReminderEmails();
    //     } catch (error) {
    //         console.error('Error in scheduled task:', error);
    //     }
    // }, {
    //     scheduled: true,
    //     timezone: 'Asia/Kolkata', // Adjust timezone as per your server's timezone
    // });
};

module.exports = {
    sendReminderEmails,
    scheduleReminderEmails,
};

// scheduleReminderEmails().then(data=>console.log(data)).catch(err=>console.log(err))