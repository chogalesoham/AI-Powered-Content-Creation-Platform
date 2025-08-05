import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../api';
import { TypewriterMessage } from '../components/TypewriterText';
import ContentCard from '../components/ContentCard';

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
    platform?: string;
    tone?: string;
    format?: string;
    wordCount: number;
    characterCount: number;
    estimatedEngagement: number;
    hashtags?: string[];
    mentions?: string[];
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
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string>('');
  const [showTypewriter, setShowTypewriter] = useState<string | null>(null);
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

      // Fallback response with typewriter effect
      const aiMessageContent = `I'm having trouble connecting to the AI service right now. Here's a sample response based on your request about "${userMessage}":`;

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiMessageContent,
        timestamp: new Date()
      };

      // Add message with typewriter effect
      setMessages(prev => [...prev, { ...aiMessage, content: '' }]);
      setShowTypewriter(aiMessage.id);
      setCurrentTypingMessage(aiMessageContent);

      // Provide fallback content with enhanced metadata
      const fallbackContent: GeneratedContent[] = [{
        id: Date.now().toString(),
        platform: 'LinkedIn',
        content: `Here's a professional post about ${userMessage}:\n\n${userMessage} is something I've been thinking about lately.\n\nIn my experience working in ${user?.niche || 'this industry'}, I've learned that...\n\n• Key insight 1\n• Key insight 2\n• Key insight 3\n\nWhat's your take on this?\n\n#${user?.niche?.replace(/\s+/g, '') || 'Professional'} #Insights`,
        metadata: {
          estimatedEngagement: Math.floor(Math.random() * 40) + 60, // 60-100%
          wordCount: 45,
          characterCount: 280,
          hashtags: [user?.niche?.replace(/\s+/g, '') || 'Professional', 'Insights', 'Leadership'],
          mentions: []
        },
        suggestions: [
          'Consider adding a personal story to increase engagement',
          'This post has strong professional appeal',
          'The question at the end encourages interaction',
          'Hashtags are well-targeted for your industry'
        ]
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
                  {message.type === 'ai' && showTypewriter === message.id ? (
                    <TypewriterMessage
                      message={currentTypingMessage}
                      speed={30}
                      onComplete={() => {
                        setMessages(prev =>
                          prev.map(msg =>
                            msg.id === message.id
                              ? { ...msg, content: currentTypingMessage }
                              : msg
                          )
                        );
                        setShowTypewriter(null);
                        setCurrentTypingMessage('');
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
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
          
          <div className="p-4 space-y-6">
            {generatedContent.map((content, index) => (
              <ContentCard
                key={content.id}
                content={content}
                onCopy={copyContent}
                onSave={saveDraft}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}