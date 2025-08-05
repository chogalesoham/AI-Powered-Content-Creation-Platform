const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: String,
    content: String,
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft' },
    createdAt: { type: Date, default: Date.now },
    scheduledFor: Date,
    engagement: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
    }
});

module.exports = mongoose.model('Content', contentSchema);