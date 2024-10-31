const mongoose = require('mongoose');

const creditScoresSchema = new mongoose.Schema({
    transunion: { type: [Number], default: [] },
    experian: { type: [Number], default: [] },
    equifax: { type: [Number], default: [] }
}, { timestamps: true });  // Optional timestamps for tracking creation and updates

const CreditScores = mongoose.model('CreditScores', creditScoresSchema);

module.exports = CreditScores;
