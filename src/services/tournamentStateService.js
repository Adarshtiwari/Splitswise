const mongoose = require("mongoose");
const TournamentState = require("../models/TournamentState");
const logger = require("../utils/logger");
const { ObjectId } = mongoose.Types;
// Function to register a user for a tournament
const registerUserForTournamentService = async (userId, tournamentId) => {
  let session;
  try {
      // Start a session for transactions
      session = await mongoose.startSession();
      session.startTransaction();

      // Calculate the next date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1); // Next day at the same time

      // MongoDB query to find entries matching tournamentId and nextDate
      const query = {
          tournamentId: tournamentId,
          date: {
              $gte: nextDate, // Greater than or equal to nextDate
              $lt: new Date(nextDate.getTime() + 24 * 60 * 60 * 1000), // Less than nextDate + 1 day
          },
      };

      logger.info(`Tournament details query: ${JSON.stringify(query)}`);
      // Fetch the tournament and lock it for update
      const tournament = await TournamentState.findById(tournamentId).session(session).exec();

      logger.info(`Tournament details: ${JSON.stringify(tournament)}`);

      if (!tournament) {
          throw new Error("Tournament not found");
      }

      // Check if the tournament date is valid (current or future)
      if (tournament.date < new Date()) {
          throw new Error("Tournament date has passed");
      }

      // Check if the tournament is already full
      if (tournament.participants.length >= tournament.totalParticipants) {
          throw new Error("Tournament is already full");
      }

      // Check if the user is already registered
      if (tournament.participants.includes(userId)) {
          throw new Error("User already registered for the tournament");
      }

      // Register the user for the tournament
      tournament.participants.push(userId);
      await tournament.save({ session });

      // Save the tournament state ID in req.body or any response object
      const tournamentStateId = tournament._id;

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return tournamentStateId
  } catch (error) {
      // If any error occurs, abort the transaction if it has not been committed
      if (session && session.inTransaction()) {
          await session.abortTransaction();
          session.endSession();
      }
      console.error("Error in registerUserForTournament:", error);
      throw error; // Re-throw the error for handling at the controller level
  }
};


const removeUserFromTournament = async (userId, tournamentId, tournamentStateId) => {
  try {
    // Start a session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Calculate the next date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1); // Next day at the same time
      logger.info(`tournamentId, userId: ${JSON.stringify(tournamentId)}, ${JSON.stringify(userId)}`);

      // MongoDB query to find entries matching tournamentId and nextDate
      const query = {
        _id: tournamentStateId,
        tournamentId: tournamentId
      };

      // Fetch the tournament and lock it for update
      const tournament = await TournamentState.findOne(query).session(session).exec();

      logger.info(`tournament result: ${JSON.stringify(tournament)}`);
      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Check if the user is registered for the tournament
      if (!tournament.participants.includes(userId)) {
        throw new Error("User is not registered for the tournament");
      }

      // Remove the user from the tournament
      tournament.participants = tournament.participants.filter(
        (participantId) => participantId.toString() !== userId.toString()
      );
      await tournament.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return tournamentStateId;
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error; // Re-throw the error for handling at the controller level
    }
  } catch (error) {
    console.error("Error in removeUserFromTournament:", error);
    throw error;
  }
};


const getTournamentDetailsForDate = async (date,tournamentId) => {
  try {
      // Calculate the start and end times for the given date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // MongoDB query to find entries matching the provided date
      const query = {
          date: {
              $gte: startOfDay, // Greater than or equal to startOfDay
              $lt: endOfDay // Less than or equal to endOfDay
          },
          ...(tournamentId && { tournamentId: tournamentId })
      };

      // Fetch the tournament and populate the necessary fields
      const tournament = await TournamentState.findOne(query)
          .populate({
              path: 'tournamentId',
              select: '_id name firstPrize secondPrize fees'
          })
          .exec();

      logger.info(`Tournament details: ${JSON.stringify(tournament)}`);

      if (!tournament) {
          throw new Error("Tournament not found");
      }

      // Get participant length
      const participantsLength = tournament.participants.length;

      // Construct the response
      const tournamentDetails = {
          tournamentStateId:tournament._id,
          tournamentId:tournament.tournamentId._id,
          name: tournament.tournamentId.name,
          startTime: tournament.date, // Assuming the date field in TournamentState is the start time
          totalparticipants:participantsLength,
          fees: tournament.tournamentId.fees,
          firstPrize: tournament.tournamentId.firstPrize,
          secondPrize: tournament.tournamentId.secondPrize
      };

      return tournamentDetails;
  } catch (error) {
      console.error("Error fetching tournament details:", error);
      throw error; // Re-throw the error for handling at the controller level
  }
};


module.exports = {
  registerUserForTournamentService,
  removeUserFromTournament,
  getTournamentDetailsForDate
};
