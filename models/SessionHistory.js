const mongoose = require('mongoose');

const sessionHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thesis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thesis',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        default: 'unknown'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast retrieval of a user's latest history
sessionHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SessionHistory', sessionHistorySchema);
