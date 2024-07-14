require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./src/utils/logger');
const connectDB = require('./src/db'); // Import connectDB function from db.js
const authController = require('./src/controllers/authController'); // Import auth controller
const { scheduleTournamentCreation, testingscheduleTournamentCreation } = require('./src/utils/tournamentScheduler');
const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(bodyParser.json());

// Central Routecr
const centralRouter = express.Router();
app.use('/api', centralRouter);

const authRouter = require('./src/routes/auth'); // Import auth routes
const adminRouter = require('./src/routes/admin');
const { scheduleReminderEmails } = require('./src/utils/sendReminderEmails');
centralRouter.use('/user', authRouter);
centralRouter.use('/admin',adminRouter );
// Connect to MongoDB and start server
scheduleTournamentCreation();
// testingscheduleTournamentCreation()
// scheduleReminderEmails();
connectDB().then(() => {
    app.listen(port, () => {
        logger.info(`Server running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
