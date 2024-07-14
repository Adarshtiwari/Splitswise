const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const tournamentResultController = require('../controllers/tournamentResultController');
const participantController = require('../controllers/participationController');
const tournamentStateController = require('../controllers/tournamentStateController');
const authenticate = require('../middleware/auth');

router.post('/create/tournament',authenticate, tournamentController.createTournament);
router.post('/add-result', authenticate,tournamentResultController.createTournamentResult);
router.put('/update-payment-status',authenticate,tournamentStateController.registerUserForTournament, participantController.updatePaymentStatus);

router.delete('/revoke-user',authenticate, participantController.revokeParticipant);
router.get('/get/user/payment-status',authenticate,participantController.getUserAndPaymentStatus );

module.exports = router;
