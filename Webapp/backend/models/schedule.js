const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    platform: String,
    frequency: String,
    contentType: String,
    lastGenerated: Date,
    nextGeneration: Date,
    active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Schedule', scheduleSchema);