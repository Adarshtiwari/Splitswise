const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const participationController = require('../controllers/participationController');
const reviewController = require('../controllers/reviewController');
const tournamentStateController = require('../controllers/tournamentStateController');
const tournamentResultController = require('../controllers/tournamentResultController');



router.post('/signup', authController.signup);
router.post('/login',authController.userLogin );
router.post('/verify-otp', authController.verifyOTP);
router.post('/update-profile', authenticate,authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

router.post('/tournament/join',authenticate,tournamentStateController.registerUserForTournament, participationController.createParticipation);
router.post('/create/Review',authenticate, reviewController.createReview);
router.get('/home/tournament/result',authenticate, tournamentResultController.getTournamentResults);
router.get('/home/get/tournament',authenticate, tournamentStateController.getTournamentDetailsForDateController);
router.get('/home/get/tournament/result',authenticate, tournamentResultController.getTournamentResults);

module.exports = router;
