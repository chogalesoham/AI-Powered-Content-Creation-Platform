import React, { useState, useEffect } from 'react';
import { Copy, Edit, Share2, Heart, MessageCircle, Repeat2, Eye, TrendingUp, Sparkles } from 'lucide-react';
import { LinkedIn, Twitter } from './SocialIcons';

interface ContentCardProps {
  content: {
    id: string;
    platform: string;
    content: string;
    metadata?: {
      estimatedEngagement: number;
      wordCount: number;
      characterCount: number;
      hashtags?: string[];
      mentions?: string[];
    };
    suggestions?: string[];
  };
  onCopy: (content: string) => void;
  onSave: (content: any) => void;
  delay?: number;
}

export default function ContentCard({ content, onCopy, onSave, delay = 0 }: ContentCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEngagement, setShowEngagement] = useState(false);
  const [animatedEngagement, setAnimatedEngagement] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && content.metadata?.estimatedEngagement) {
      setTimeout(() => {
        setShowEngagement(true);
        animateEngagement();
      }, 800);
    }
  }, [isVisible, content.metadata?.estimatedEngagement]);

  const animateEngagement = () => {
    const target = content.metadata?.estimatedEngagement || 0;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedEngagement(target);
        clearInterval(timer);
      } else {
        setAnimatedEngagement(Math.floor(current));
      }
    }, duration / steps);
  };

  const handleCopy = () => {
    onCopy(content.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformStyles = () => {
    switch (content.platform) {
      case 'LinkedIn':
        return {
          gradient: 'from-blue-500 to-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: <LinkedIn className="w-5 h-5" />,
          accent: 'bg-blue-500'
        };
      case 'Twitter':
        return {
          gradient: 'from-sky-400 to-blue-500',
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          text: 'text-sky-700',
          icon: <Twitter className="w-5 h-5" />,
          accent: 'bg-sky-500'
        };
      case 'Instagram':
        return {
          gradient: 'from-pink-500 via-purple-500 to-indigo-500',
          bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
          border: 'border-pink-200',
          text: 'text-purple-700',
          icon: <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg"></div>,
          accent: 'bg-gradient-to-r from-pink-500 to-purple-500'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-700',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: <Share2 className="w-5 h-5" />,
          accent: 'bg-gray-500'
        };
    }
  };

  const platformStyles = getPlatformStyles();

  return (
    <div 
      className={`relative transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className={`bg-white rounded-xl border-2 ${platformStyles.border} p-6 shadow-lg hover:shadow-xl transition-all duration-300 backface-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Platform Header */}
          <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${platformStyles.bg}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${platformStyles.text}`}>
                {platformStyles.icon}
              </div>
              <div>
                <h3 className={`font-semibold ${platformStyles.text}`}>{content.platform}</h3>
                <p className="text-xs text-gray-500">Generated content</p>
              </div>
            </div>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className={`p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 ${platformStyles.text}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Content Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[120px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50" 
                 style={{ background: `linear-gradient(to right, ${platformStyles.gradient})` }}></div>
            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {content.content.length > 200 ? content.content.substring(0, 200) + '...' : content.content}
            </p>
          </div>

          {/* Engagement Score Animation */}
          {showEngagement && content.metadata && (
            <div className={`mb-4 p-3 rounded-lg ${platformStyles.bg} border ${platformStyles.border}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-4 h-4 ${platformStyles.text}`} />
                  <span className={`text-sm font-medium ${platformStyles.text}`}>Engagement Score</span>
                </div>
                <div className={`text-lg font-bold ${platformStyles.text}`}>
                  {animatedEngagement}%
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${platformStyles.gradient} transition-all duration-1500 ease-out`}
                  style={{ width: `${animatedEngagement}%` }}
                ></div>
              </div>
              
              {/* Engagement Metrics */}
              <div className="flex justify-between mt-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{Math.floor(animatedEngagement * 2.3)} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{Math.floor(animatedEngagement * 0.8)} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Repeat2 className="w-3 h-3" />
                  <span>{Math.floor(animatedEngagement * 1.2)} shares</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className={`flex-1 px-4 py-2 bg-gradient-to-r ${platformStyles.gradient} text-white text-sm rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={() => onSave(content)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className={`absolute inset-0 bg-white rounded-xl border-2 ${platformStyles.border} p-6 shadow-lg rotate-y-180 backface-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${platformStyles.text}`}>Full Content</h3>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${platformStyles.text}`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {content.content}
              </p>
            </div>

            {/* Metadata */}
            {content.metadata && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{content.metadata.wordCount} words</span>
                  <span>{content.metadata.characterCount} characters</span>
                </div>
                
                {content.metadata.hashtags && (
                  <div className="flex flex-wrap gap-1">
                    {content.metadata.hashtags.map((tag, index) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded-full ${platformStyles.bg} ${platformStyles.text}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {content.suggestions && content.suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">AI Insights</span>
                </div>
                <div className="space-y-1">
                  {content.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-xs text-yellow-700">• {suggestion}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
