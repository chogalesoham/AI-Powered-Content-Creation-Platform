const openaiService = require('../services/openaiService');
const toneAnalyzer = require('../services/toneAnalyzer');
const contentGenerator = require('../services/contentGenerator');

class AIHelpers {
    constructor() {
        this.templateLibrary = {
            linkedin: {
                'Startup Update': {
                    structure: "🚀 [Milestone/Update]\n\n[Story/Context]\n\n💡 Key learnings:\n• [Learning 1]\n• [Learning 2]\n• [Learning 3]\n\n[Call to action]\n\n#StartupLife #Entrepreneurship #Growth",
                    example: "🚀 Just hit 1000 users!\n\nSix months ago, this was just an idea scribbled on a napkin...\n\n💡 Key learnings:\n• Validation beats perfection\n• Community feedback is gold\n• Persistence pays off\n\nWhat milestone are you working toward?\n\n#StartupLife #Entrepreneurship #Growth"
                },
                'Leadership Tip': {
                    structure: "Leadership isn't about [common misconception].\n\nIt's about [real truth].\n\n[Personal story or example]\n\n[Actionable advice]\n\nWhat's your take on leadership?\n\n#Leadership #Management #Growth",
                    example: "Leadership isn't about having all the answers.\n\nIt's about asking the right questions.\n\nLast week, instead of solving a team conflict myself, I asked: 'What would success look like for everyone involved?'\n\nThe team found their own solution in 20 minutes.\n\nSometimes the best leaders just facilitate the conversation.\n\nWhat's your take on leadership?\n\n#Leadership #Management #Growth"
                }
            },
            twitter: {
                'Quick Tip': {
                    structure: "💡 [Industry] tip:\n\n[Actionable advice in 1-2 sentences]\n\n[Optional: Why it works]\n\n#[RelevantHashtag]",
                    example: "💡 Marketing tip:\n\nStop selling features. Start selling transformations.\n\nPeople don't buy a drill. They buy the hole.\n\n#Marketing"
                },
                'Hot Take': {
                    structure: "Hot take: [Controversial but thoughtful opinion]\n\n[Brief explanation]\n\n[Question to engage audience]\n\n#[RelevantHashtag]",
                    example: "Hot take: Most 'productivity hacks' make you less productive.\n\nThey create the illusion of progress while distracting from deep work.\n\nWhat's one productivity tip you've abandoned?\n\n#Productivity"
                }
            }
        };

        this.engagementBoosters = {
            hooks: [
                "Here's what nobody tells you about...",
                "I made a $10K mistake so you don't have to:",
                "Plot twist:",
                "Unpopular opinion:",
                "3 years ago, I thought... Today, I know...",
                "The best advice I never took:",
                "What I wish I knew at 25:",
                "This changed everything:"
            ],
            ctas: [
                "What's your experience with this?",
                "Agree or disagree?",
                "What would you add to this list?",
                "Share your thoughts below 👇",
                "Tag someone who needs to see this",
                "What's your take?",
                "Have you tried this approach?",
                "What's worked for you?"
            ]
        };
    }

    async generateContentSuggestions(userInput, userProfile) {
        try {
            const suggestions = [];

            // Generate platform-specific suggestions
            for (const platform of userProfile.platforms || ['LinkedIn']) {
                const suggestion = await contentGenerator.generateContent(userInput, {
                    platform: platform.toLowerCase(),
                    tone: userProfile.tone || 'professional',
                    userProfile,
                    contentGoals: userProfile.goals || [],
                    niche: userProfile.niche || ''
                });

                if (suggestion.success) {
                    suggestions.push({
                        platform,
                        content: suggestion.content,
                        metadata: suggestion.metadata
                    });
                }
            }

            // Add template-based suggestions
            const templateSuggestions = this.getTemplateSuggestions(userInput, userProfile);
            suggestions.push(...templateSuggestions);

            return {
                success: true,
                suggestions,
                count: suggestions.length
            };
        } catch (error) {
            console.error('Error generating content suggestions:', error);
            return {
                success: false,
                error: 'Failed to generate content suggestions'
            };
        }
    }

    getTemplateSuggestions(userInput, userProfile) {
        const suggestions = [];
        const platforms = userProfile.platforms || ['LinkedIn'];

        platforms.forEach(platform => {
            const platformKey = platform.toLowerCase();
            const templates = this.templateLibrary[platformKey] || {};

            Object.entries(templates).forEach(([templateName, templateData]) => {
                if (this.isTemplateRelevant(userInput, templateName)) {
                    suggestions.push({
                        platform,
                        content: this.adaptTemplate(templateData.structure, userInput, userProfile),
                        metadata: {
                            type: 'template',
                            templateName,
                            platform: platformKey
                        }
                    });
                }
            });
        });

        return suggestions;
    }

    isTemplateRelevant(userInput, templateName) {
        const input = userInput.toLowerCase();
        const relevanceMap = {
            'Startup Update': ['startup', 'milestone', 'launch', 'growth', 'update', 'achievement'],
            'Leadership Tip': ['leadership', 'management', 'team', 'advice', 'tip', 'guide'],
            'Quick Tip': ['tip', 'advice', 'how to', 'guide', 'hack'],
            'Hot Take': ['opinion', 'controversial', 'unpopular', 'debate', 'think']
        };

        const keywords = relevanceMap[templateName] || [];
        return keywords.some(keyword => input.includes(keyword));
    }

    adaptTemplate(template, userInput, userProfile) {
        // Simple template adaptation - replace placeholders with user-specific content
        let adapted = template;

        // Replace common placeholders
        adapted = adapted.replace(/\[Industry\]/g, userProfile.niche || 'your industry');
        adapted = adapted.replace(/\[Milestone\/Update\]/g, userInput);
        adapted = adapted.replace(/\[Story\/Context\]/g, 'Here\'s the story...');

        return adapted;
    }

    async improveContent(originalContent, improvementType, userProfile) {
        const improvementPrompts = {
            engagement: "Make this content more engaging and likely to generate comments and shares:",
            clarity: "Make this content clearer and easier to understand:",
            professional: "Make this content more professional while maintaining authenticity:",
            casual: "Make this content more conversational and approachable:",
            shorter: "Make this content more concise while keeping the key message:",
            longer: "Expand this content with more details, examples, or insights:"
        };

        const prompt = improvementPrompts[improvementType];
        if (!prompt) {
            return { success: false, error: 'Invalid improvement type' };
        }

        try {
            const fullPrompt = `${prompt}\n\nOriginal content: "${originalContent}"\n\nUser's typical style: ${userProfile?.voiceDescription || 'Professional communication'}`;

            const result = await openaiService.generateContent(fullPrompt, {
                tone: userProfile?.tone || 'professional',
                maxTokens: 500,
                temperature: 0.7
            });

            return result;
        } catch (error) {
            console.error('Content improvement error:', error);
            return { success: false, error: 'Failed to improve content' };
        }
    }

    async generateHashtagSuggestions(content, platform, count = 5) {
        try {
            const prompt = `Generate ${count} relevant hashtags for this ${platform} post: "${content}". Return only the hashtags, separated by spaces.`;

            const result = await openaiService.generateContent(prompt, {
                maxTokens: 100,
                temperature: 0.5
            });

            if (result.success) {
                const hashtags = result.content
                    .split(/\s+/)
                    .filter(tag => tag.startsWith('#'))
                    .slice(0, count);

                return {
                    success: true,
                    hashtags
                };
            }

            return result;
        } catch (error) {
            console.error('Hashtag generation error:', error);
            return { success: false, error: 'Failed to generate hashtags' };
        }
    }

    getRandomHook() {
        const hooks = this.engagementBoosters.hooks;
        return hooks[Math.floor(Math.random() * hooks.length)];
    }

    getRandomCTA() {
        const ctas = this.engagementBoosters.ctas;
        return ctas[Math.floor(Math.random() * ctas.length)];
    }

    async analyzeContentPerformance(content, platform) {
        // Analyze content for potential performance indicators
        const analysis = {
            readabilityScore: this.calculateReadability(content),
            engagementPotential: contentGenerator.estimateEngagement(content, platform),
            lengthAnalysis: this.analyzeLengthOptimization(content, platform),
            hashtagAnalysis: this.analyzeHashtags(content, platform),
            toneConsistency: await this.analyzeToneConsistency(content)
        };

        return {
            success: true,
            analysis,
            recommendations: this.generateRecommendations(analysis)
        };
    }

    calculateReadability(content) {
        // Simple readability calculation based on sentence and word length
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).filter(w => w.length > 0);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgCharsPerWord = content.replace(/\s/g, '').length / words.length;

        // Simple scoring (lower is more readable)
        let score = 100;
        if (avgWordsPerSentence > 20) score -= 20;
        if (avgCharsPerWord > 6) score -= 15;

        return Math.max(0, Math.min(100, score));
    }

    analyzeLengthOptimization(content, platform) {
        const platformLimits = {
            linkedin: { optimal: { min: 150, max: 1500 }, max: 3000 },
            twitter: { optimal: { min: 100, max: 250 }, max: 280 },
            instagram: { optimal: { min: 125, max: 1000 }, max: 2200 }
        };

        const limits = platformLimits[platform] || platformLimits.linkedin;
        const length = content.length;

        let status = 'optimal';
        if (length < limits.optimal.min) status = 'too_short';
        else if (length > limits.optimal.max) status = 'too_long';
        else if (length > limits.max) status = 'exceeds_limit';

        return {
            currentLength: length,
            optimalRange: limits.optimal,
            maxLength: limits.max,
            status,
            utilizationPercentage: (length / limits.max) * 100
        };
    }

    analyzeHashtags(content, platform) {
        const hashtags = content.match(/#\w+/g) || [];
        const platformOptimal = {
            linkedin: { min: 3, max: 5 },
            twitter: { min: 1, max: 3 },
            instagram: { min: 5, max: 10 }
        };

        const optimal = platformOptimal[platform] || platformOptimal.linkedin;
        const count = hashtags.length;

        let status = 'optimal';
        if (count < optimal.min) status = 'too_few';
        else if (count > optimal.max) status = 'too_many';

        return {
            count,
            hashtags,
            optimalRange: optimal,
            status
        };
    }

    async analyzeToneConsistency(content) {
        try {
            const analysis = await toneAnalyzer.analyzePastPosts(content);
            return analysis.success ? analysis.profile : null;
        } catch (error) {
            console.error('Tone consistency analysis error:', error);
            return null;
        }
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.readabilityScore < 70) {
            recommendations.push({
                type: 'readability',
                message: 'Consider using shorter sentences and simpler words to improve readability',
                priority: 'medium'
            });
        }

        if (analysis.engagementPotential < 50) {
            recommendations.push({
                type: 'engagement',
                message: 'Add questions or calls-to-action to increase engagement potential',
                priority: 'high'
            });
        }

        if (analysis.lengthAnalysis.status === 'too_short') {
            recommendations.push({
                type: 'length',
                message: 'Content might be too short. Consider adding more value or context',
                priority: 'medium'
            });
        }

        if (analysis.hashtagAnalysis.status === 'too_few') {
            recommendations.push({
                type: 'hashtags',
                message: `Add ${analysis.hashtagAnalysis.optimalRange.min - analysis.hashtagAnalysis.count} more hashtags for better discoverability`,
                priority: 'low'
            });
        }

        return recommendations;
    }
}

module.exports = new AIHelpers();
