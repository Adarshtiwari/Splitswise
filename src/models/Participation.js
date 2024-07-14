// models/Participation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participationSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    tournamentStateId: { type: Schema.Types.ObjectId, ref: 'TournamentState', required: true },
    paymentStatus: { type: Boolean, default: false },
    pubgId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Participation = mongoose.model('Participation', participationSchema);

module.exports = Participation;
