const axios = require('axios');

class OpenAIService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseURL = 'https://api.openai.com/v1';
        
        if (!this.apiKey) {
            console.warn('OpenAI API key not found. AI features will be disabled.');
        }
    }

    async generateContent(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const {
            platform = 'linkedin',
            tone = 'professional',
            maxTokens = 500,
            temperature = 0.7
        } = options;

        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: this.getSystemPrompt(platform, tone)
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                content: response.data.choices[0].message.content.trim(),
                usage: response.data.usage
            };
        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.error?.message || 'Failed to generate content'
            };
        }
    }

    getSystemPrompt(platform, tone) {
        const platformSpecs = {
            linkedin: {
                maxLength: 3000,
                style: 'Professional networking post with engaging hook, valuable insights, and call-to-action',
                hashtags: 'Use 3-5 relevant hashtags',
                format: 'Hook + Story/Insight + Value + CTA'
            },
            twitter: {
                maxLength: 280,
                style: 'Concise, engaging tweet with strong hook',
                hashtags: 'Use 1-3 hashtags',
                format: 'Hook + Value in minimal words'
            },
            instagram: {
                maxLength: 2200,
                style: 'Visual-first caption with storytelling',
                hashtags: 'Use 5-10 hashtags',
                format: 'Story + Value + Engagement question'
            }
        };

        const spec = platformSpecs[platform] || platformSpecs.linkedin;
        
        return `You are an expert social media content creator specializing in ${platform} posts. 

PLATFORM: ${platform.toUpperCase()}
TONE: ${tone}
MAX LENGTH: ${spec.maxLength} characters
STYLE: ${spec.style}
HASHTAGS: ${spec.hashtags}
FORMAT: ${spec.format}

Create engaging, ${tone} content that:
1. Starts with a compelling hook
2. Provides genuine value to the audience
3. Matches the specified tone perfectly
4. Follows ${platform} best practices
5. Includes appropriate hashtags
6. Encourages engagement

Keep the content authentic, actionable, and platform-optimized.`;
    }

    async analyzeTone(text) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `Analyze the tone and writing style of the provided text. Return a JSON object with:
                            {
                                "tone": "primary tone (professional, casual, inspirational, etc.)",
                                "style_elements": ["list", "of", "style", "characteristics"],
                                "voice_description": "brief description of the writing voice",
                                "confidence": 0.95
                            }`
                        },
                        {
                            role: 'user',
                            content: text
                        }
                    ],
                    max_tokens: 300,
                    temperature: 0.3
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const analysis = response.data.choices[0].message.content.trim();
            return {
                success: true,
                analysis: JSON.parse(analysis)
            };
        } catch (error) {
            console.error('Tone Analysis Error:', error.response?.data || error.message);
            return {
                success: false,
                error: 'Failed to analyze tone'
            };
        }
    }

    async generateContentIdeas(niche, goals, count = 5) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `Generate ${count} content ideas for someone in the ${niche} niche with goals: ${goals.join(', ')}. 
                            Return a JSON array of objects with:
                            {
                                "title": "Content idea title",
                                "description": "Brief description",
                                "platform": "best platform for this content",
                                "hook": "suggested opening hook",
                                "cta": "suggested call to action"
                            }`
                        },
                        {
                            role: 'user',
                            content: `Generate content ideas for ${niche} focusing on ${goals.join(', ')}`
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.8
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const ideas = response.data.choices[0].message.content.trim();
            return {
                success: true,
                ideas: JSON.parse(ideas)
            };
        } catch (error) {
            console.error('Content Ideas Error:', error.response?.data || error.message);
            return {
                success: false,
                error: 'Failed to generate content ideas'
            };
        }
    }
}

module.exports = new OpenAIService();
