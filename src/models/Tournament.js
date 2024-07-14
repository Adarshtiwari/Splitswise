const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    checkin_period: { type: String, default: '30 min' },
    firstPrize: { type: Number, required: true },
    secondPrize: { type: Number, required: true },
    fees: { type: Number, required: true },
    image: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
