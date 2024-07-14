const participationService = require('../services/participationService');
const { removeUserFromTournament } = require('../services/tournamentStateService');
const TournamentState = require('../models/TournamentState');
const Participation = require('../models/Participation');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/emailNotification');
const { EMAIL_SUBJECTS, EMAIL_BODIES } = require('../constant/emailBody');

const createParticipation = async (req, res) => {
    try {
        const participationData = req.body;
        logger.info(` participationData controller req body ${JSON.stringify(participationData)}`)
        const participation = await participationService.createParticipation(participationData);
        const subject=EMAIL_SUBJECTS.TOURNAMENT_REGISTRATION
        const body=EMAIL_BODIES.TOURNAMENT_REGISTRATION(req.user.name)
        await sendEmail(req.user.email, subject, body);
        logger.info(` participation after service  ${JSON.stringify(participation)}`)
        res.status(201).json(participation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updatePaymentStatus = async (req, res) => {
    try {
        const { participantId } = req.body;

        if (!participantId) {
            return res.status(400).json({ error: 'Participant ID is required' });
        }

        const participant = await participantService.updatePaymentStatus(participantId);
        res.json(participant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const revokeParticipant = async (req, res) => {
    try {
          
        if(! req.user.role)
            {
                throw new Error('user not Authorise to perform this task')
            }

        const { participantId,tournamentId,tournamentStateId } = req.body;

        if (!participantId) {
            return res.status(400).json({ error: 'Participant ID is required' });
        }
        if (!tournamentId) {
            return res.status(400).json({ error: 'TournamentId ID is required' });
        }

           await removeUserFromTournament(participantId,tournamentId,tournamentStateId);
           logger.info(` particpant remove from Tournament State ${JSON.stringify(tournamentStateId)}`)
         await participationService.removeParticipant(participantId,tournamentId,tournamentStateId)
         logger.info(` particpant remove from participant Table ${JSON.stringify(participationService)}`)

         res.status(200).json({ message: `particpant has been sucessfully removed` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserAndPaymentStatus = async (req, res) => {
    try {
        if(! req.user.role)
            {
                throw new Error('user not Authorise to perform this task')
            }
        logger.info(` get User And Payment Status ${JSON.stringify(req.body)}`)
     
        const participant = await participationService.getPaymentStatusWithFilter(req.body);
        res.json(participant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    createParticipation,
    updatePaymentStatus,
    revokeParticipant,
    getUserAndPaymentStatus
};
