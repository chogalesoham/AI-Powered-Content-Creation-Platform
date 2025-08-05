// AIML Module - AI-Powered Content Creation Services
// Main entry point for all AI/ML functionality

const openaiService = require('./services/openaiService');
const toneAnalyzer = require('./services/toneAnalyzer');
const contentGenerator = require('./services/contentGenerator');
const aiHelpers = require('./utils/aiHelpers');

class AIML {
    constructor() {
        this.services = {
            openai: openaiService,
            toneAnalyzer: toneAnalyzer,
            contentGenerator: contentGenerator,
            helpers: aiHelpers
        };
    }

    // Main content generation method
    async generateContent(prompt, options = {}) {
        try {
            return await this.services.contentGenerator.generateContent(prompt, options);
        } catch (error) {
            console.error('AIML Content Generation Error:', error);
            return {
                success: false,
                error: 'Failed to generate content'
            };
        }
    }

    // Analyze user's tone from past posts
    async analyzeTone(pastPosts) {
        try {
            return await this.services.toneAnalyzer.analyzePastPosts(pastPosts);
        } catch (error) {
            console.error('AIML Tone Analysis Error:', error);
            return {
                success: false,
                error: 'Failed to analyze tone'
            };
        }
    }

    // Generate content suggestions based on user input
    async getContentSuggestions(userInput, userProfile) {
        try {
            return await this.services.helpers.generateContentSuggestions(userInput, userProfile);
        } catch (error) {
            console.error('AIML Content Suggestions Error:', error);
            return {
                success: false,
                error: 'Failed to generate content suggestions'
            };
        }
    }

    // Improve existing content
    async improveContent(content, improvementType, userProfile) {
        try {
            return await this.services.helpers.improveContent(content, improvementType, userProfile);
        } catch (error) {
            console.error('AIML Content Improvement Error:', error);
            return {
                success: false,
                error: 'Failed to improve content'
            };
        }
    }

    // Generate content ideas
    async generateContentIdeas(niche, goals, count = 5) {
        try {
            return await this.services.openai.generateContentIdeas(niche, goals, count);
        } catch (error) {
            console.error('AIML Content Ideas Error:', error);
            return {
                success: false,
                error: 'Failed to generate content ideas'
            };
        }
    }

    // Generate scheduled content
    async generateScheduledContent(userProfile, scheduleSettings) {
        try {
            return await this.services.contentGenerator.generateScheduledContent(userProfile, scheduleSettings);
        } catch (error) {
            console.error('AIML Scheduled Content Error:', error);
            return {
                success: false,
                error: 'Failed to generate scheduled content'
            };
        }
    }

    // Analyze content performance potential
    async analyzeContent(content, platform) {
        try {
            return await this.services.helpers.analyzeContentPerformance(content, platform);
        } catch (error) {
            console.error('AIML Content Analysis Error:', error);
            return {
                success: false,
                error: 'Failed to analyze content'
            };
        }
    }

    // Generate hashtag suggestions
    async generateHashtags(content, platform, count = 5) {
        try {
            return await this.services.helpers.generateHashtagSuggestions(content, platform, count);
        } catch (error) {
            console.error('AIML Hashtag Generation Error:', error);
            return {
                success: false,
                error: 'Failed to generate hashtags'
            };
        }
    }

    // Get random engagement boosters
    getEngagementBoosters() {
        return {
            hook: this.services.helpers.getRandomHook(),
            cta: this.services.helpers.getRandomCTA()
        };
    }

    // Health check for AI services
    async healthCheck() {
        const checks = {
            openai: false,
            services: true,
            timestamp: new Date().toISOString()
        };

        try {
            // Test OpenAI connection
            const testResult = await this.services.openai.generateContent('Test', {
                maxTokens: 10,
                temperature: 0.1
            });
            checks.openai = testResult.success;
        } catch (error) {
            console.error('OpenAI health check failed:', error);
            checks.openai = false;
        }

        return {
            success: true,
            checks,
            status: checks.openai ? 'healthy' : 'degraded'
        };
    }

    // Initialize AI services
    async initialize() {
        try {
            console.log('Initializing AIML services...');
            
            // Perform health check
            const health = await this.healthCheck();
            
            if (health.checks.openai) {
                console.log('✅ AIML services initialized successfully');
            } else {
                console.log('⚠️  AIML services initialized with limited functionality (OpenAI unavailable)');
            }

            return {
                success: true,
                status: health.status,
                message: 'AIML services initialized'
            };
        } catch (error) {
            console.error('Failed to initialize AIML services:', error);
            return {
                success: false,
                error: 'Failed to initialize AIML services'
            };
        }
    }
}

// Export singleton instance
module.exports = new AIML();
