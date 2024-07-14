
const { registerUserForTournamentService, getTournamentDetailsForDate } = require('../services/tournamentStateService');
const logger = require('../utils/logger');

// Function to register a user for a tournament
const registerUserForTournament = async (req, res,next) => {
    const { userId, tournamentId,tournamentStateId } = req.body;
     logger.info(`tournament and user id  ${JSON.stringify(tournamentId)}`)
    try {
       req.body.tournamentStateId= await registerUserForTournamentService(userId,tournamentStateId);
        next();
    } catch (error) {
        console.error('Error in tournament registration:', error);
        res.status(500).json({ error:error.message });
    }
}

const getTournamentDetailsForDateController = async (req, res) => {
    logger.info(`tournament get by date: ${JSON.stringify(req.query)}`)
    const { date,tournamentId } = req.query;
    
    try {
        const tournamentDetail= await getTournamentDetailsForDate(date,tournamentId);
        res.status(200).json({ tournamentDetail });
    } catch (error) {
        console.error('Error in tournament details  getting:', error);
        res.status(500).json({ error:error.message });
    }
}



module.exports = {
    registerUserForTournament,
    getTournamentDetailsForDateController
};
