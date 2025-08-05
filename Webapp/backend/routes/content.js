const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ContentDraft = require('../models/contentDraft');
const ScheduledPost = require('../models/scheduledPost');
const AIML = require('../../AIML');

// Get all content drafts for user
router.get('/drafts', auth, async (req, res) => {
    try {
        const { status, platform, limit = 20 } = req.query;

        let query = { userId: req.user.userId };
        if (status) query.status = status;
        if (platform) query.platform = platform;

        const drafts = await ContentDraft.find(query)
            .sort({ lastModified: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            drafts
        });
    } catch (error) {
        console.error('Error fetching content drafts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch content drafts'
        });
    }
});

// Create new content draft
router.post('/drafts', auth, async (req, res) => {
    try {
        const { title, platform, content, contentType, metadata, tags } = req.body;

        if (!title || !platform || !content) {
            return res.status(400).json({
                success: false,
                error: 'Title, platform, and content are required'
            });
        }

        // Calculate metadata if not provided
        const calculatedMetadata = {
            wordCount: content.split(/\s+/).length,
            characterCount: content.length,
            hashtags: (content.match(/#\w+/g) || []),
            ...metadata
        };

        const draft = new ContentDraft({
            userId: req.user.userId,
            title,
            platform,
            content,
            contentType: contentType || 'Personal',
            metadata: calculatedMetadata,
            tags: tags || []
        });

        await draft.save();

        res.status(201).json({
            success: true,
            draft
        });
    } catch (error) {
        console.error('Error creating content draft:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create content draft'
        });
    }
});

// AI-powered content generation endpoint
router.post('/generate', auth, async (req, res) => {
    try {
        const { prompt, platform, contentType, saveAsDraft = true } = req.body;

        if (!prompt || !platform) {
            return res.status(400).json({
                success: false,
                error: 'Prompt and platform are required'
            });
        }

        // Get user profile for AI generation
        const User = require('../models/user');
        const user = await User.findById(req.user.userId);

        // Generate content using AI
        const aiResult = await AIML.generateContent(prompt, {
            platform: platform.toLowerCase(),
            tone: user.tone || 'professional',
            userProfile: {
                niche: user.niche,
                goals: user.goals,
                voiceDescription: user.toneProfile?.voiceDescription
            },
            contentGoals: user.goals || [],
            format: contentType
        });

        if (!aiResult.success) {
            return res.status(500).json({
                success: false,
                error: aiResult.error || 'Failed to generate content'
            });
        }

        let draft = null;
        if (saveAsDraft) {
            // Save as draft
            draft = new ContentDraft({
                userId: req.user.userId,
                title: `AI Generated - ${platform} Post`,
                platform,
                content: aiResult.content,
                contentType: contentType || 'Personal',
                metadata: {
                    ...aiResult.metadata,
                    aiGenerated: true,
                    wordCount: aiResult.content.split(/\s+/).length,
                    characterCount: aiResult.content.length,
                    hashtags: (aiResult.content.match(/#\w+/g) || [])
                }
            });
            await draft.save();
        }

        res.json({
            success: true,
            content: aiResult.content,
            metadata: aiResult.metadata,
            draft: draft
        });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content'
        });
    }
});

// Get content statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const [draftStats, scheduledStats] = await Promise.all([
            ContentDraft.aggregate([
                { $match: { userId: req.user.userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            ScheduledPost.aggregate([
                { $match: { userId: req.user.userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        const stats = {
            drafts: draftStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            scheduled: scheduledStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching content stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch content statistics'
        });
    }
});

module.exports = router;