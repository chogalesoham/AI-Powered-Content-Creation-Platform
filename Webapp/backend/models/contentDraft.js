const mongoose = require('mongoose');

const contentDraftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['LinkedIn', 'Twitter', 'Instagram']
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['Company Updates', 'Thought Leadership', 'Personal', 'Educational', 'Product'],
        default: 'Personal'
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published'],
        default: 'draft'
    },
    metadata: {
        tone: String,
        wordCount: Number,
        characterCount: Number,
        estimatedEngagement: Number,
        hashtags: [String],
        aiGenerated: { type: Boolean, default: false },
        templateUsed: String
    },
    tags: [String],
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
contentDraftSchema.index({ userId: 1, status: 1 });
contentDraftSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ContentDraft', contentDraftSchema);
