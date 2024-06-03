const { User } = require('../Model/splitwise-Model');
const nodemailer = require('nodemailer');
require('dotenv').config()
const Admin_Email = process.env.Admin_Email;  
const Admin_Email_Password = process.env.Admin_Email_Password;

console.log(" the admin mail ",Admin_Email)
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Admin_Email,
        pass: Admin_Email_Password
    }
});
 

const mailSender = async (req, res) => {
    try {
        let name = '';
        const { payerId, amount, type, participants } = req.body;
        const allparticipants = await Promise.all(participants.map(participantId => User.findById(participantId)));
        
        if (type === 'EQUAL') {
            participants.forEach(participantId => {
                const data = allparticipants.find(ele => ele._id === participantId);
                if (data) {
                    name += data.name + " amount " + amount + "\n";
                }
            });
        } else if (type === 'EXACT') {
            participants.forEach((participantId, index) => {
                const data = allparticipants.find(ele => ele._id === participantId);
                if (data) {
                    name += data.name + " amount " + req.body.shares[index];
                }
            });
        } else if (type === 'PERCENT') {
            participants.forEach((participantId, index) => {
                const data = allparticipants.find(ele => ele._id === participantId);
                if (data) {
                    name += data.name + " amount " + (amount * req.body.percentages[index]) / 100;
                }
            });
        }

        const payer = await User.findById(payerId);
        if (payer) {
            let mailDetails = {
                from: 'abtiwari797@gmail.com',
                to: 'abtiwari797@gmail.com',
                subject: "Expense Add By you",
                text: `Expense have added amount ${amount} to ${name} `
            };

            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                   throw err
                } else {
                    // return ({status_Email:true,error:"not found" })
                }
            });
        }

        for (let i = 0; i < participants.length; i++) {
            let mailDetails = {
                from: 'abtiwari797@gmail.com',
                to: 'abtiwari797@gmail.com',
                subject: "Expense Add By " + payer.name,
                text: `Split Details amunt ${amount} to ${name} `
            };

            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                   throw err
                } else {
                    console.log(" email sent ")
                    // return ({status_Email:true,error:"not found" })
                }
            });
        }

        res.json({ message: 'Expense added successfully' });
    } catch(err) {
        console.error('Error Sending Email:', err);
        res.status(200).json({ err: 'Expenses Add But Error To send Notification' });
    }
}


module.exports={
    mailSender
}