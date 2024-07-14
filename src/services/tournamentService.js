const Tournament = require('../models/Tournament');
const logger = require('../utils/logger');

const createTournament = async (tournamentData) => {
    try {
        logger.info(` create Tournament service ${JSON.stringify(tournamentData)}`)
        const tournament = new Tournament(tournamentData);
        await tournament.save();
        return tournament;
    } catch (error) {
        logger.error(` error Tournament service ${JSON.stringify(error.message)}`)
        throw new Error('Error creating tournament: ' + error.message);
    }
};

module.exports = {
    createTournament
};
