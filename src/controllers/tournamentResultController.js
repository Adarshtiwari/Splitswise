const tournamentResultService = require('../services/tournamentResultService');

const createTournamentResult = async (req, res) => {
    try {

        if(! req.user.role)
            {
                throw new Error('user not Authorise to perform this task')
            }
        const { userId, tournamentId, TournamentStateId, rank, prize } = req.body;

        // Validate incoming data
        if (!userId || !tournamentId || !TournamentStateId || !rank || !prize) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Call the service function to create the tournament result
        const result = await tournamentResultService.createTournamentResult(userId, tournamentId, TournamentStateId, rank, prize);

        return res.status(201).json({ message: 'Tournament result created successfully', result });
    } catch (error) {
        console.error('Error creating tournament result:', error);
        return res.status(500).json({ error: error.message});
    }
};

const getTournamentResults = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const username = req.body.username || null;
        const tournamentName = req.body.tournamentName || null;
        const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
        const endDate = req.body.endDate ? new Date(req.body.endDate) : null;

        const filter = { username, tournamentName, startDate, endDate };

        const results = await tournamentResultService.getTournamentResults(filter, page, limit);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createTournamentResult,
    getTournamentResults
};
