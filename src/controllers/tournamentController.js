const tournamentService = require('../services/tournamentService');
const logger = require('../utils/logger');

const createTournament = async (req, res) => {
    try {
        if(!req.user.role)
            {
                logger.error(`user not authorise to create tournament ${JSON.stringify(req.user)}`)
               throw new Error(`user not authorise to create tournament`)
            }
        const tournamentData = req.body;
        const tournament = await tournamentService.createTournament(tournamentData);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createTournament,

};
