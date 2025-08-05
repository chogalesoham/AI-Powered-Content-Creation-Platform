const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AIML = require('../../AIML');

// Generate content using AI
router.post('/generate-content', auth, async (req, res) => {
    try {
        const { prompt, platform, tone, userProfile, contentGoals, niche, format } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        const options = {
            platform: platform || 'linkedin',
            tone: tone || 'professional',
            userProfile: userProfile || {},
            contentGoals: contentGoals || [],
            niche: niche || '',
            format: format || null
        };

        const result = await AIML.generateContent(prompt, options);
        res.json(result);
    } catch (error) {
        console.error('AI content generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content'
        });
    }
});

// Analyze tone from past posts
router.post('/analyze-tone', auth, async (req, res) => {
    try {
        const { pastPosts } = req.body;

        if (!pastPosts) {
            return res.status(400).json({
                success: false,
                error: 'Past posts are required for tone analysis'
            });
        }

        const result = await AIML.analyzeTone(pastPosts);
        res.json(result);
    } catch (error) {
        console.error('AI tone analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze tone'
        });
    }
});

// Get content suggestions
router.post('/content-suggestions', auth, async (req, res) => {
    try {
        const { userInput, userProfile } = req.body;

        if (!userInput) {
            return res.status(400).json({
                success: false,
                error: 'User input is required'
            });
        }

        const result = await AIML.getContentSuggestions(userInput, userProfile || {});
        res.json(result);
    } catch (error) {
        console.error('AI content suggestions error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content suggestions'
        });
    }
});

// Improve existing content
router.post('/improve-content', auth, async (req, res) => {
    try {
        const { content, improvementType, userProfile } = req.body;

        if (!content || !improvementType) {
            return res.status(400).json({
                success: false,
                error: 'Content and improvement type are required'
            });
        }

        const validTypes = ['engagement', 'clarity', 'professional', 'casual', 'shorter', 'longer'];
        if (!validTypes.includes(improvementType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid improvement type'
            });
        }

        const result = await AIML.improveContent(content, improvementType, userProfile || {});
        res.json(result);
    } catch (error) {
        console.error('AI content improvement error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to improve content'
        });
    }
});

// Generate content ideas
router.post('/content-ideas', auth, async (req, res) => {
    try {
        const { niche, goals, count } = req.body;

        if (!niche || !goals) {
            return res.status(400).json({
                success: false,
                error: 'Niche and goals are required'
            });
        }

        const result = await AIML.generateContentIdeas(niche, goals, count || 5);
        res.json(result);
    } catch (error) {
        console.error('AI content ideas error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content ideas'
        });
    }
});

// Generate scheduled content
router.post('/scheduled-content', auth, async (req, res) => {
    try {
        const { userProfile, scheduleSettings } = req.body;

        if (!userProfile || !scheduleSettings) {
            return res.status(400).json({
                success: false,
                error: 'User profile and schedule settings are required'
            });
        }

        const result = await AIML.generateScheduledContent(userProfile, scheduleSettings);
        res.json(result);
    } catch (error) {
        console.error('AI scheduled content error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate scheduled content'
        });
    }
});

// Analyze content performance potential
router.post('/analyze-content', auth, async (req, res) => {
    try {
        const { content, platform } = req.body;

        if (!content || !platform) {
            return res.status(400).json({
                success: false,
                error: 'Content and platform are required'
            });
        }

        const result = await AIML.analyzeContent(content, platform);
        res.json(result);
    } catch (error) {
        console.error('AI content analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze content'
        });
    }
});

// Generate hashtag suggestions
router.post('/generate-hashtags', auth, async (req, res) => {
    try {
        const { content, platform, count } = req.body;

        if (!content || !platform) {
            return res.status(400).json({
                success: false,
                error: 'Content and platform are required'
            });
        }

        const result = await AIML.generateHashtags(content, platform, count || 5);
        res.json(result);
    } catch (error) {
        console.error('AI hashtag generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate hashtags'
        });
    }
});

// Get engagement boosters
router.get('/engagement-boosters', auth, async (req, res) => {
    try {
        const result = AIML.getEngagementBoosters();
        res.json({
            success: true,
            boosters: result
        });
    } catch (error) {
        console.error('AI engagement boosters error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get engagement boosters'
        });
    }
});

// AI health check
router.get('/health', async (req, res) => {
    try {
        const result = await AIML.healthCheck();
        res.json(result);
    } catch (error) {
        console.error('AI health check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check AI health'
        });
    }
});

module.exports = router;
