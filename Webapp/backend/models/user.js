const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: String,
    role: String,
    platforms: [String],
    niche: String,
    tone: String,
    goals: [String],
    pastPosts: String,
    postFrequency: String,
    toneProfile: {
        primaryTone: String,
        styleElements: [String],
        voiceDescription: String,
        confidence: Number,
        analysisMethod: String
    },
    preferences: {
        defaultPlatform: { type: String, default: 'linkedin' },
        autoAnalyzeTone: { type: Boolean, default: true },
        contentLength: { type: String, default: 'medium' },
        includeHashtags: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);