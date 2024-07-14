const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentResultSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    TournamentStateId: { type: Schema.Types.ObjectId, ref: 'TournamentState', required: true },
    rank: { type: Number, enum: [1, 2], required: true },
    prize: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
tournamentResultSchema.index({ userId: 1, tournamentId: 1, TournamentStateId: 1 }, { unique: true });

const TournamentResult = mongoose.model('TournamentResult', tournamentResultSchema);

module.exports = TournamentResult;
