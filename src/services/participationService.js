
const mongoose = require('mongoose');
const Participation = require('../models/Participation');
const logger = require('../utils/logger');
const User = require('../models/User');

const createParticipation = async (participationData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        logger.info(`Creating participation: ${JSON.stringify(participationData)}`);
        const participation = new Participation(participationData);
        logger.info(`Participant object created: ${JSON.stringify(participation)}`);
        await participation.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return participation;
    } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();

        logger.error(`Error creating participation: ${error.message}`);
        throw new Error('Error creating participation: ' + error.message);
    }
};

const updatePaymentStatus = async (participantId) => {
    try {
        const participant = await Participant.findById(participantId);
        if (!participant) {
            throw new Error('Participant not found');
        }

        participant.paymentStatus = true;
        participant.updatedAt = Date.now();
        await participant.save();
        return participant;
    } catch (error) {
        throw new Error('Error updating payment status: ' + error.message);
    }
};

const removeParticipant = async (userId, tournamentId,tournamentStateId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const filter = { userId: userId, tournamentId: tournamentId,tournamentStateId:tournamentStateId };
        logger.info(` participant Delete By in  Participant Table ${JSON.stringify(filter)}` ) 
        const result = await Participation.deleteOne(filter).session(session);
        logger.info(` participant Delete from Participant Table ${JSON.stringify(result)}` )  

        if (result.deletedCount === 0) {
            throw new Error('Participant not found');
        }

        logger.info(`Participant removed: ${userId} from tournament ${tournamentId}`);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, message: 'Participant removed successfully' };
    } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        
        logger.error(`Error removing participant: ${error.message}`);
        throw new Error('Error removing participant: ' + error.message);
    }
};

const getPaymentStatusWithFilter = async ({ tournamentStateId, tournamentId, username, email, startDate, endDate }) => {
    try {
        const query = {};

        if (tournamentStateId) {
            query.tournamentStateId = tournamentStateId;
        }

        if (tournamentId) {
            query.tournamentId = tournamentId;
        }

        if (username) {
            const user = await User.findOne({ name: username });
            if (!user) {
                throw new Error('User not found');
            }
            query.userId = user._id;
        }

        if (email) {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User not found');
            }
            query.userId = user._id;
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lt:  new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) };
        } else if (startDate) {
            query.createdAt = { $gte: startDate };
        } else if (endDate) {
            query.createdAt = { $lt:  new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) };
        }

        const participations = await Participation.find(query)
            .populate({
                path: 'userId',
                select: 'name email pubgId',
            })
            .populate({
                path: 'tournamentStateId',
                select: 'date totalParticipants',
                populate: {
                    path: 'tournamentId',
                    select: 'name firstPrize secondPrize fees',
                },
            })
            .exec();

            logger.info(`user details with payment status ${JSON.stringify(participations)}`)

        return participations;
    } catch (error) {
        throw new Error('Error fetching payment status: ' + error.message);
    }
};


module.exports = {
    createParticipation,
    updatePaymentStatus,
    removeParticipant,
    getPaymentStatusWithFilter
};
