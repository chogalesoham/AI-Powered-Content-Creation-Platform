const openaiService = require('./openaiService');

class ToneAnalyzer {
    constructor() {
        this.toneCategories = {
            professional: {
                keywords: ['expertise', 'industry', 'insights', 'strategy', 'analysis'],
                characteristics: ['formal language', 'industry jargon', 'data-driven']
            },
            casual: {
                keywords: ['hey', 'awesome', 'cool', 'fun', 'easy'],
                characteristics: ['conversational', 'informal', 'friendly']
            },
            inspirational: {
                keywords: ['believe', 'achieve', 'dream', 'success', 'motivation'],
                characteristics: ['uplifting', 'encouraging', 'aspirational']
            },
            educational: {
                keywords: ['learn', 'understand', 'explain', 'guide', 'tutorial'],
                characteristics: ['informative', 'structured', 'helpful']
            },
            humorous: {
                keywords: ['funny', 'joke', 'laugh', 'hilarious', 'amusing'],
                characteristics: ['witty', 'entertaining', 'light-hearted']
            },
            authoritative: {
                keywords: ['research', 'proven', 'evidence', 'study', 'expert'],
                characteristics: ['confident', 'credible', 'fact-based']
            }
        };
    }

    async analyzePastPosts(pastPosts) {
        if (!pastPosts || pastPosts.trim().length === 0) {
            return this.getDefaultToneProfile();
        }

        try {
            // Use OpenAI for detailed analysis
            const aiAnalysis = await openaiService.analyzeTone(pastPosts);
            
            if (aiAnalysis.success) {
                return {
                    success: true,
                    profile: {
                        primaryTone: aiAnalysis.analysis.tone,
                        styleElements: aiAnalysis.analysis.style_elements,
                        voiceDescription: aiAnalysis.analysis.voice_description,
                        confidence: aiAnalysis.analysis.confidence,
                        analysisMethod: 'ai'
                    }
                };
            }

            // Fallback to rule-based analysis
            return this.performRuleBasedAnalysis(pastPosts);

        } catch (error) {
            console.error('Tone analysis error:', error);
            return this.performRuleBasedAnalysis(pastPosts);
        }
    }

    performRuleBasedAnalysis(text) {
        const words = text.toLowerCase().split(/\s+/);
        const toneScores = {};

        // Initialize scores
        Object.keys(this.toneCategories).forEach(tone => {
            toneScores[tone] = 0;
        });

        // Score based on keywords
        words.forEach(word => {
            Object.entries(this.toneCategories).forEach(([tone, data]) => {
                if (data.keywords.some(keyword => word.includes(keyword))) {
                    toneScores[tone]++;
                }
            });
        });

        // Additional heuristics
        const sentenceCount = text.split(/[.!?]+/).length;
        const avgSentenceLength = words.length / sentenceCount;
        const exclamationCount = (text.match(/!/g) || []).length;
        const questionCount = (text.match(/\?/g) || []).length;

        // Adjust scores based on writing patterns
        if (avgSentenceLength > 20) {
            toneScores.professional += 2;
            toneScores.authoritative += 1;
        } else if (avgSentenceLength < 10) {
            toneScores.casual += 2;
        }

        if (exclamationCount > sentenceCount * 0.2) {
            toneScores.inspirational += 2;
            toneScores.humorous += 1;
        }

        if (questionCount > sentenceCount * 0.1) {
            toneScores.educational += 1;
            toneScores.casual += 1;
        }

        // Find dominant tone
        const dominantTone = Object.entries(toneScores)
            .sort(([,a], [,b]) => b - a)[0][0];

        const confidence = Math.min(0.8, toneScores[dominantTone] / words.length * 10);

        return {
            success: true,
            profile: {
                primaryTone: dominantTone,
                styleElements: this.toneCategories[dominantTone].characteristics,
                voiceDescription: this.generateVoiceDescription(dominantTone, toneScores),
                confidence: confidence,
                analysisMethod: 'rule-based',
                scores: toneScores
            }
        };
    }

    generateVoiceDescription(primaryTone, scores) {
        const descriptions = {
            professional: "Uses formal language with industry expertise and data-driven insights",
            casual: "Conversational and approachable with friendly, informal communication",
            inspirational: "Motivational and uplifting, encouraging others to achieve their goals",
            educational: "Clear and informative, focused on teaching and sharing knowledge",
            humorous: "Entertaining and witty, using humor to engage the audience",
            authoritative: "Confident and credible, backed by research and expertise"
        };

        const secondaryTones = Object.entries(scores)
            .filter(([tone]) => tone !== primaryTone)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([tone]) => tone);

        let description = descriptions[primaryTone];
        
        if (secondaryTones.length > 0) {
            description += ` with elements of ${secondaryTones.join(' and ')} communication`;
        }

        return description;
    }

    getDefaultToneProfile() {
        return {
            success: true,
            profile: {
                primaryTone: 'professional',
                styleElements: ['formal language', 'industry focus', 'structured content'],
                voiceDescription: 'Professional and informative communication style',
                confidence: 0.5,
                analysisMethod: 'default'
            }
        };
    }

    async generateToneGuidelines(userProfile) {
        const { primaryTone, styleElements } = userProfile;
        
        const guidelines = {
            professional: {
                dos: [
                    "Use industry-specific terminology appropriately",
                    "Include data and insights to support points",
                    "Maintain formal but approachable language",
                    "Structure content with clear sections"
                ],
                donts: [
                    "Avoid overly casual expressions",
                    "Don't use excessive emojis",
                    "Avoid unsubstantiated claims",
                    "Don't use slang or colloquialisms"
                ]
            },
            casual: {
                dos: [
                    "Use conversational language",
                    "Include personal anecdotes",
                    "Ask questions to engage audience",
                    "Use emojis and casual expressions"
                ],
                donts: [
                    "Avoid overly formal language",
                    "Don't be too corporate",
                    "Avoid complex jargon",
                    "Don't sound robotic"
                ]
            },
            inspirational: {
                dos: [
                    "Share personal growth stories",
                    "Use motivational language",
                    "Include calls to action",
                    "Focus on positive outcomes"
                ],
                donts: [
                    "Avoid negative or pessimistic content",
                    "Don't be preachy",
                    "Avoid generic motivational quotes",
                    "Don't ignore real challenges"
                ]
            }
        };

        return guidelines[primaryTone] || guidelines.professional;
    }

    async adaptContentToTone(content, targetTone, userProfile) {
        if (!content || !targetTone) {
            return { success: false, error: 'Content and target tone are required' };
        }

        try {
            const adaptationPrompt = `
                Adapt the following content to match a ${targetTone} tone while maintaining the core message:
                
                Original content: "${content}"
                
                User's typical style: ${userProfile?.voiceDescription || 'Professional communication'}
                
                Make the content sound ${targetTone} while keeping it authentic and valuable.
            `;

            const result = await openaiService.generateContent(adaptationPrompt, {
                tone: targetTone,
                maxTokens: 400,
                temperature: 0.7
            });

            return result;
        } catch (error) {
            console.error('Content adaptation error:', error);
            return { success: false, error: 'Failed to adapt content tone' };
        }
    }
}

module.exports = new ToneAnalyzer();
