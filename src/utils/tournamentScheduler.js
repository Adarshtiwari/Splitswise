const mongoose = require('mongoose');
const cron = require('node-cron');
const TournamentState = require('../models/TournamentState'); // Adjust path as needed
const Tournament = require('../models/Tournament');

// Establish MongoDB connection (replace with your MongoDB URI)


// Function to schedule and create new TournamentState entries
const scheduleTournamentCreation = () => {
    // Define the cron job to run every day at 8 pm
    cron.schedule('0 20 * * *', async () => {
        try {
            const tournaments = await Tournament.find().exec();
     
            console.log(" tournament ",tournaments)
    
            if (!tournaments || tournaments.length === 0) {
                console.error('No tournaments found in the Tournament collection');
                return;
            }
    
            // Calculate the date for the next day at 8 pm
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 1);
            nextDate.setHours(20, 0, 0, 0); // Set to 8 pm
    
            // Iterate over each tournament and create a new TournamentState entry
            for (const tournament of tournaments) {
                const existingEntry = await TournamentState.findOne({
                    tournamentId: tournament._id,
                    date: nextDate
                }).exec();
    
                if (existingEntry) {
                    console.log('TournamentState entry already exists for:', tournament._id, nextDate);
                    continue; // Skip if the entry already exists
                }
    
                const newTournamentState = new TournamentState({
                    date: nextDate,
                    tournamentId: tournament._id,
                    totalParticipants: tournament.size,
                    participants: []
                });
    
                // Save the new TournamentState entry
                await newTournamentState.save();
                console.log('New TournamentState entry created:', newTournamentState);
            }
        } catch (error) {
            console.error('Error creating TournamentState entry:', error);
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata' // Adjust timezone as needed
    });
};
 const testingscheduleTournamentCreation=async ()=>{
    try {
        const tournaments = await Tournament.find().exec();
 
        console.log(" tournament ",tournaments)

        if (!tournaments || tournaments.length === 0) {
            console.error('No tournaments found in the Tournament collection');
            return;
        }

        // Calculate the date for the next day at 8 pm
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(20, 0, 0, 0); // Set to 8 pm

        // Iterate over each tournament and create a new TournamentState entry
        for (const tournament of tournaments) {
            const existingEntry = await TournamentState.findOne({
                tournamentId: tournament._id,
                date: nextDate
            }).exec();

            if (existingEntry) {
                console.log('TournamentState entry already exists for:', tournament._id, nextDate);
                continue; // Skip if the entry already exists
            }

            const newTournamentState = new TournamentState({
                date: nextDate,
                tournamentId: tournament._id,
                totalParticipants: tournament.size,
                participants: []
            });

            // Save the new TournamentState entry
            await newTournamentState.save();
            console.log('New TournamentState entry created:', newTournamentState);
        }
    } catch (error) {
        console.error('Error creating TournamentState entry:', error);
    }
 }


module.exports = {
    scheduleTournamentCreation,
    testingscheduleTournamentCreation
};
