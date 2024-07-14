const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentStateSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    totalParticipants: { type: Number, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const TournamentState = mongoose.model('TournamentState', tournamentStateSchema);

module.exports = TournamentState;
