const openaiService = require('./openaiService');
const toneAnalyzer = require('./toneAnalyzer');

class ContentGenerator {
    constructor() {
        this.platformTemplates = {
            linkedin: {
                formats: [
                    'story_insight',
                    'list_tips',
                    'question_engagement',
                    'milestone_celebration',
                    'industry_analysis',
                    'personal_lesson'
                ],
                maxLength: 3000,
                hashtagCount: { min: 3, max: 5 }
            },
            twitter: {
                formats: [
                    'quick_tip',
                    'hot_take',
                    'thread_starter',
                    'question_poll',
                    'quote_insight',
                    'news_reaction'
                ],
                maxLength: 280,
                hashtagCount: { min: 1, max: 3 }
            },
            instagram: {
                formats: [
                    'behind_scenes',
                    'carousel_tips',
                    'story_caption',
                    'user_generated',
                    'product_showcase',
                    'lifestyle_content'
                ],
                maxLength: 2200,
                hashtagCount: { min: 5, max: 10 }
            }
        };

        this.contentCategories = {
            'Brand Awareness': {
                topics: ['company culture', 'brand story', 'values', 'mission'],
                ctas: ['Learn more about us', 'Follow for updates', 'Visit our website']
            },
            'Lead Generation': {
                topics: ['free resources', 'case studies', 'demos', 'consultations'],
                ctas: ['Download now', 'Book a call', 'Get started free', 'Contact us']
            },
            'Thought Leadership': {
                topics: ['industry insights', 'predictions', 'analysis', 'opinions'],
                ctas: ['What do you think?', 'Share your thoughts', 'Let\'s discuss']
            },
            'Community Building': {
                topics: ['questions', 'polls', 'discussions', 'user stories'],
                ctas: ['Join the conversation', 'Share your experience', 'Tag a friend']
            },
            'Product Promotion': {
                topics: ['features', 'benefits', 'use cases', 'testimonials'],
                ctas: ['Try it now', 'Learn more', 'Get started', 'See it in action']
            }
        };
    }

    async generateContent(prompt, options = {}) {
        const {
            platform = 'linkedin',
            tone = 'professional',
            userProfile = {},
            contentGoals = [],
            niche = '',
            format = null
        } = options;

        try {
            // Enhance prompt with user context
            const enhancedPrompt = this.enhancePrompt(prompt, {
                platform,
                tone,
                userProfile,
                contentGoals,
                niche,
                format
            });

            // Generate content using OpenAI
            const result = await openaiService.generateContent(enhancedPrompt, {
                platform,
                tone,
                maxTokens: this.getMaxTokens(platform),
                temperature: 0.7
            });

            if (result.success) {
                // Post-process the content
                const processedContent = await this.postProcessContent(
                    result.content,
                    platform,
                    userProfile
                );

                return {
                    success: true,
                    content: processedContent,
                    metadata: {
                        platform,
                        tone,
                        format: format || 'custom',
                        wordCount: processedContent.split(' ').length,
                        characterCount: processedContent.length,
                        estimatedEngagement: this.estimateEngagement(processedContent, platform)
                    }
                };
            }

            return result;
        } catch (error) {
            console.error('Content generation error:', error);
            return {
                success: false,
                error: 'Failed to generate content'
            };
        }
    }

    enhancePrompt(originalPrompt, context) {
        const { platform, tone, userProfile, contentGoals, niche, format } = context;

        let enhancedPrompt = `Create a ${platform} post about: ${originalPrompt}\n\n`;

        // Add user context
        if (niche) {
            enhancedPrompt += `Industry/Niche: ${niche}\n`;
        }

        if (contentGoals.length > 0) {
            enhancedPrompt += `Content Goals: ${contentGoals.join(', ')}\n`;
        }

        if (userProfile.voiceDescription) {
            enhancedPrompt += `Writing Style: ${userProfile.voiceDescription}\n`;
        }

        // Add format guidance
        if (format && this.platformTemplates[platform].formats.includes(format)) {
            enhancedPrompt += `Format: ${this.getFormatGuidance(format)}\n`;
        }

        // Add platform-specific requirements
        const platformSpec = this.platformTemplates[platform];
        enhancedPrompt += `\nPlatform Requirements:
- Maximum ${platformSpec.maxLength} characters
- Include ${platformSpec.hashtagCount.min}-${platformSpec.hashtagCount.max} relevant hashtags
- Optimize for ${platform} engagement patterns\n`;

        // Add content goal specific guidance
        if (contentGoals.length > 0) {
            const goalGuidance = this.getGoalGuidance(contentGoals[0]);
            if (goalGuidance) {
                enhancedPrompt += `\nContent Strategy: ${goalGuidance}\n`;
            }
        }

        enhancedPrompt += `\nTone: ${tone}
Make it engaging, authentic, and valuable to the target audience.`;

        return enhancedPrompt;
    }

    getFormatGuidance(format) {
        const formatGuides = {
            story_insight: "Start with a personal story, then extract a valuable insight or lesson",
            list_tips: "Create a numbered list of actionable tips or strategies",
            question_engagement: "Pose a thought-provoking question to encourage discussion",
            milestone_celebration: "Share an achievement and the journey behind it",
            industry_analysis: "Provide expert analysis on industry trends or news",
            personal_lesson: "Share a personal learning experience and its broader application",
            quick_tip: "Share one actionable tip in a concise format",
            hot_take: "Express a bold opinion on a trending topic",
            thread_starter: "Create the first tweet of a potential thread",
            question_poll: "Ask an engaging question suitable for a poll",
            quote_insight: "Share an insightful quote with personal commentary",
            news_reaction: "React to recent news with your perspective"
        };

        return formatGuides[format] || "Create engaging content in your preferred format";
    }

    getGoalGuidance(goal) {
        const goalGuides = {
            'Brand Awareness': "Focus on showcasing your brand personality, values, and what makes you unique",
            'Lead Generation': "Include a clear value proposition and compelling call-to-action",
            'Thought Leadership': "Share unique insights, predictions, or expert analysis",
            'Community Building': "Encourage interaction, ask questions, and foster discussion",
            'Product Promotion': "Highlight benefits and real-world applications without being overly salesy"
        };

        return goalGuides[goal];
    }

    async postProcessContent(content, platform, userProfile) {
        // Ensure content meets platform requirements
        const platformSpec = this.platformTemplates[platform];
        
        if (content.length > platformSpec.maxLength) {
            // Truncate while preserving hashtags
            const hashtagMatch = content.match(/#\w+/g);
            const hashtags = hashtagMatch ? hashtagMatch.join(' ') : '';
            const mainContent = content.replace(/#\w+/g, '').trim();
            
            const availableLength = platformSpec.maxLength - hashtags.length - 10;
            const truncatedContent = mainContent.substring(0, availableLength) + '...';
            
            content = `${truncatedContent}\n\n${hashtags}`;
        }

        // Ensure proper hashtag count
        const currentHashtags = (content.match(/#\w+/g) || []).length;
        const { min, max } = platformSpec.hashtagCount;

        if (currentHashtags < min) {
            // Add relevant hashtags based on content
            const additionalHashtags = await this.generateHashtags(content, platform, min - currentHashtags);
            content += ' ' + additionalHashtags.join(' ');
        } else if (currentHashtags > max) {
            // Remove excess hashtags
            const hashtags = content.match(/#\w+/g) || [];
            const keepHashtags = hashtags.slice(0, max);
            content = content.replace(/#\w+/g, '').trim() + ' ' + keepHashtags.join(' ');
        }

        return content.trim();
    }

    async generateHashtags(content, platform, count) {
        // Simple hashtag generation based on content keywords
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way'];
        
        const relevantWords = words
            .filter(word => !commonWords.includes(word))
            .slice(0, count);

        return relevantWords.map(word => `#${word.charAt(0).toUpperCase() + word.slice(1)}`);
    }

    getMaxTokens(platform) {
        const tokenLimits = {
            linkedin: 600,
            twitter: 100,
            instagram: 500
        };
        return tokenLimits[platform] || 400;
    }

    estimateEngagement(content, platform) {
        let score = 0;

        // Question marks increase engagement
        score += (content.match(/\?/g) || []).length * 10;

        // Emojis can increase engagement (but not too many)
        const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
        score += Math.min(emojiCount * 5, 25);

        // Call-to-action phrases
        const ctaPhrases = ['comment', 'share', 'like', 'follow', 'subscribe', 'join', 'download', 'learn more'];
        ctaPhrases.forEach(phrase => {
            if (content.toLowerCase().includes(phrase)) {
                score += 15;
            }
        });

        // Platform-specific factors
        if (platform === 'linkedin') {
            // Professional insights and industry terms
            const professionalTerms = ['insight', 'strategy', 'leadership', 'growth', 'innovation'];
            professionalTerms.forEach(term => {
                if (content.toLowerCase().includes(term)) {
                    score += 10;
                }
            });
        }

        // Normalize score to 0-100
        return Math.min(Math.max(score, 0), 100);
    }

    async generateScheduledContent(userProfile, scheduleSettings) {
        const { platforms, contentGoals, niche, tone, postFrequency } = userProfile;
        const { topics, contentTypes } = scheduleSettings;

        const contentPlan = [];

        for (const platform of platforms) {
            for (const topic of topics) {
                const content = await this.generateContent(topic, {
                    platform: platform.toLowerCase(),
                    tone,
                    userProfile,
                    contentGoals,
                    niche
                });

                if (content.success) {
                    contentPlan.push({
                        platform,
                        topic,
                        content: content.content,
                        metadata: content.metadata,
                        scheduledFor: this.calculateScheduleTime(postFrequency),
                        status: 'draft'
                    });
                }
            }
        }

        return {
            success: true,
            contentPlan,
            summary: {
                totalPosts: contentPlan.length,
                platforms: platforms.length,
                topics: topics.length
            }
        };
    }

    calculateScheduleTime(frequency) {
        const now = new Date();
        const scheduleMap = {
            daily: 1,
            weekly: 7,
            biweekly: 14,
            monthly: 30
        };

        const days = scheduleMap[frequency] || 7;
        const scheduledDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
        
        return scheduledDate;
    }
}

module.exports = new ContentGenerator();
