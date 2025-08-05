import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Edit, Trash2, Linkedin as LinkedIn, Twitter, Sparkles } from 'lucide-react';
import api from '../api';

interface ContentChatProps {
  user: any;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  platform?: string;
  contentType?: string;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  metadata?: {
    platform: string;
    tone: string;
    format: string;
    wordCount: number;
    characterCount: number;
    estimatedEngagement: number;
  };
  suggestions?: string[];
}

export default function ContentChat({ user }: ContentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi ${user?.name || 'there'}! I'm your AI content assistant. I can help you create engaging posts for LinkedIn and Twitter/X based on your brand voice and audience. What would you like to create today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      // Get content suggestions from AI
      const response = await api.post('/ai/content-suggestions', {
        userInput: userMessage,
        userProfile: {
          platforms: user?.platforms || ['LinkedIn'],
          tone: user?.tone || 'professional',
          niche: user?.niche || '',
          goals: user?.goals || [],
          voiceDescription: user?.toneProfile?.voiceDescription || ''
        }
      });

      if (response.data.success) {
        const suggestions = response.data.suggestions;

        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `I've generated ${suggestions.length} content suggestions based on your request. Each is optimized for different platforms and engagement styles:`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);

        // Convert AI suggestions to GeneratedContent format
        const generatedContent: GeneratedContent[] = suggestions.map((suggestion: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          platform: suggestion.platform,
          content: suggestion.content,
          metadata: suggestion.metadata,
          suggestions: suggestion.metadata?.type === 'template'
            ? [`Template: ${suggestion.metadata.templateName}`]
            : ['AI Generated Content', `Engagement Score: ${suggestion.metadata?.estimatedEngagement || 'N/A'}`]
        }));

        setGeneratedContent(generatedContent);
      } else {
        throw new Error(response.data.error || 'Failed to generate content');
      }
    } catch (error: any) {
      console.error('AI Response Error:', error);

      // Fallback response
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I'm having trouble connecting to the AI service right now. Here's a sample response based on your request about "${userMessage}":`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Provide fallback content
      const fallbackContent: GeneratedContent[] = [{
        id: Date.now().toString(),
        platform: 'LinkedIn',
        content: `Here's a professional post about ${userMessage}:\n\n${userMessage} is something I've been thinking about lately.\n\nIn my experience working in ${user?.niche || 'this industry'}, I've learned that...\n\n• Key insight 1\n• Key insight 2\n• Key insight 3\n\nWhat's your take on this?\n\n#${user?.niche?.replace(/\s+/g, '') || 'Professional'} #Insights`,
        suggestions: ['Fallback content - AI service unavailable']
      }];

      setGeneratedContent(fallbackContent);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    await generateAIResponse(inputValue);
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const saveDraft = (content: GeneratedContent) => {
    // In a real app, this would save to your backend
    console.log('Saving draft:', content);
  };

  return (
    <div className="flex-1 flex h-screen">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-900">AI Content Assistant</h1>
          <p className="text-gray-600 text-sm">Generate platform-optimized content that matches your voice</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-500 ml-3' 
                    : 'bg-gray-200 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-3xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 mr-3">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          {/* Quick Actions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                `Create a LinkedIn post about ${user?.niche || 'our milestone'}`,
                `Write a ${user?.tone || 'professional'} thought leadership post`,
                `Generate a Twitter thread about ${user?.niche || 'industry trends'}`,
                `Create content for ${user?.company || 'our'} product launch`,
                `Write about ${user?.niche || 'industry'} trends and insights`,
                `Share a personal story about ${user?.role || 'leadership'}`,
                `Create educational content about ${user?.niche || 'our expertise'}`
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInputValue(prompt)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage}>
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me to create content... (e.g., 'Create a LinkedIn post about our milestone')"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Generated Content Panel */}
      {generatedContent.length > 0 && (
        <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
            <p className="text-sm text-gray-600">Review and customize your drafts</p>
          </div>
          
          <div className="p-4 space-y-4">
            {generatedContent.map((content) => (
              <div key={content.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {content.platform === 'LinkedIn' ? (
                      <LinkedIn className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Twitter className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700">{content.platform}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => copyContent(content.content)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Copy content"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveDraft(content)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Save as draft"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{content.content}</p>
                </div>
                
                <div className="space-y-2">
                  {content.metadata && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-green-600">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Engagement: {content.metadata.estimatedEngagement}%
                      </div>
                      <div className="text-gray-500">
                        {content.metadata.wordCount} words • {content.metadata.characterCount} chars
                      </div>
                    </div>
                  )}

                  {content.suggestions && content.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">💡 Insights:</p>
                      {content.suggestions.map((suggestion, index) => (
                        <p key={index} className="text-xs text-gray-600">• {suggestion}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600">
                    Save Draft
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}