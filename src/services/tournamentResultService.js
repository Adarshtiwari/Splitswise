const mongoose = require('mongoose');

const TournamentResult = require('../models/TournamentResult');
const Tournaments = require('../models/Tournament');
const logger = require('../utils/logger');
// Service function to create a tournament result
const createTournamentResult = async (userId, tournamentId, TournamentStateId, rank) => {
 
    try {
  
        const tournamentsResult = await Tournaments.findById(tournamentId);
        logger.info(` tournament get by ID ${JSON.stringify(tournamentsResult)}`)
        if (Object.keys(tournamentsResult).length==0 ) {
            throw new Error('tournament Not Found');
        }

        // Check if there's already a result for the given user in the same tournament state
        const existingResult = await TournamentResult.findOne({ userId, tournamentId, TournamentStateId });
        if (existingResult) {
            throw new Error('Result already exists for this user in the tournament');
        }

        // Check if the user already has a rank in the tournament
        const userExistingResult = await TournamentResult.findOne({ userId, TournamentStateId });
        if (userExistingResult ) {
            throw new Error('User already has a different rank in this tournament');
        }

    
        const prize=rank===1?tournamentsResult.firstPrize:tournamentsResult.secondPrize
        logger.info(` tournament Result Insert Data ${JSON.stringify({
            userId,
            tournamentId,
            TournamentStateId,
            rank,
            prize
        })}`)
        // Create a new tournament result
        const newResult = new TournamentResult({
            userId,
            tournamentId,
            TournamentStateId,
            rank,
            prize
        });

        await newResult.save();

        return { success: true, result: newResult };
    } catch (error) {
        console.error('Error creating tournament result:', error);
        throw error;
    }
};

const getTournamentResults = async (filter, page = 1, limit = 20) => {
    try {
        const { email, tournamentName, startDate, endDate } = filter;

        // Build the base query
        let query = {};

        // Optional filters
        if (email) {
            query['user.email'] = { $regex: new RegExp(email, 'i') }; // Case-insensitive email search
        }
        if (tournamentName) {
            query['tournament.name'] = { $regex: new RegExp(tournamentName, 'i') }; // Case-insensitive tournament name search
        }
        if (startDate && endDate) {
            query['tournamentState.date'] = {
                $gte: new Date(startDate),
                $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
            };
        }

        // Aggregate options
        const options = [
            {
                $lookup: {
                    from: 'tournaments',
                    localField: 'tournamentId',
                    foreignField: '_id',
                    as: 'tournament'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'tournamentstates',
                    localField: 'TournamentStateId',
                    foreignField: '_id',
                    as: 'tournamentState'
                }
            },
            { $unwind: '$tournament' },
            { $unwind: '$user' },
            { $unwind: '$tournamentState' },
            {
                $match: query
            },
            {
                $project: {
                    _id: 0,
                    Name: '$user.name',
                    email: '$user.email',
                    prize: '$prize',
                    rank: '$rank',
                    tournamentName: '$tournament.name',
                    date: '$tournamentState.date',
                    tournamentSize: '$tournament.size',
                    tournamentFees: '$tournament.fees',
                    userAge: { $subtract: [new Date().getFullYear(), { $year: { $dateFromString: { dateString: '$user.DOB' } } }] }
                }
            }
        ];

        // Pagination settings
        const startIndex = (page - 1) * limit;
        logger.info(`get tournament Details query ${JSON.stringify(query)}`);

        // Count total documents
        const totalCount = await TournamentResult.countDocuments(query);

        // Aggregate pipeline
        const results = await TournamentResult.aggregate([
            ...options,
            { $skip: startIndex },
            { $limit: limit }
        ]);

        return { results, totalCount };
    } catch (error) {
        throw new Error('Error fetching tournament results: ' + error.message);
    }
};


module.exports = {
    createTournamentResult,
    getTournamentResults
};
