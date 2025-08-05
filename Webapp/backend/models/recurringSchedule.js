const mongoose = require('mongoose');

const recurringScheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['LinkedIn', 'Twitter', 'Instagram']
    },
    contentType: {
        type: String,
        required: true,
        enum: ['Company Updates', 'Thought Leadership', 'Personal', 'Educational', 'Product']
    },
    frequency: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'biweekly', 'monthly']
    },
    timeOfDay: {
        type: String,
        required: true // Format: "HH:MM"
    },
    dayOfWeek: {
        type: Number, // 0-6, Sunday = 0
        default: null // Only for weekly/biweekly
    },
    dayOfMonth: {
        type: Number, // 1-31
        default: null // Only for monthly
    },
    active: {
        type: Boolean,
        default: true
    },
    lastGenerated: {
        type: Date,
        default: null
    },
    nextGeneration: {
        type: Date,
        required: true
    },
    contentPrompts: [{
        type: String
    }],
    settings: {
        tone: String,
        includeHashtags: { type: Boolean, default: true },
        contentLength: { type: String, default: 'medium' }
    }
}, {
    timestamps: true
});

// Index for efficient queries
recurringScheduleSchema.index({ userId: 1, active: 1 });
recurringScheduleSchema.index({ nextGeneration: 1, active: 1 });

module.exports = mongoose.model('RecurringSchedule', recurringScheduleSchema);
