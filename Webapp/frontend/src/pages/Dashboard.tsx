import React, { useState, useEffect, useRef } from 'react';
import ChatBot from '../components/ChatBot';

// 50 AI Insights options
const AI_INSIGHTS_OPTIONS = [];
for (let i = 1; i <= 50; i++) {
  AI_INSIGHTS_OPTIONS.push({
    title: `AI Insight #${i}`,
    text: `This is a dynamic AI insight suggestion number ${i}. Try this tip for better engagement!`
  });
}

function getRandomAIInsights() {
  // Shuffle and pick 3 random insights for display
  const shuffled = [...AI_INSIGHTS_OPTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}
import { TrendingUp, Calendar, FileText, MessageSquare, Clock, Target, Sparkles, Brain } from 'lucide-react';
import api from '../api';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  // State variables
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [contentStats, setContentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const counterRefs = useRef<(HTMLElement | null)[]>([]);

  // Counter animation function
  const animateCounter = (element: HTMLElement, start: number, end: number, duration: number = 2000) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);

      element.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Trigger animations after data loads
  useEffect(() => {
    if (!loading) {
      // Welcome animation
      setTimeout(() => setShowWelcome(true), 100);

      // Stats animation
      setTimeout(() => {
        setShowStats(true);
        // Animate counters
        const currentStats = stats;
        currentStats.forEach((stat, index) => {
          const element = counterRefs.current[index];
          if (element) {
            const numericValue = parseInt(stat.value) || 0;
            setTimeout(() => {
              animateCounter(element, 0, numericValue, 1500 + index * 200);
            }, 300 + index * 150);
          }
        });
      }, 500);
    }
  }, [loading, contentStats]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [insightsRes, draftsRes, scheduledRes, statsRes] = await Promise.all([
        api.get('/ai/engagement-boosters').catch(() => ({ data: { success: false } })),
        api.get('/content/drafts?limit=5').catch(() => ({ data: { success: false, drafts: [] } })),
        api.get('/schedule/posts?limit=5').catch(() => ({ data: { success: false, posts: [] } })),
        api.get('/content/stats').catch(() => ({ data: { success: false } }))
      ]);

      if (insightsRes.data.success) {
        setAiInsights(insightsRes.data.boosters);
      }
      if (draftsRes.data.success) {
        setRecentDrafts(draftsRes.data.drafts);
      }
      if (scheduledRes.data.success) {
        setScheduledPosts(scheduledRes.data.posts);
      }
      if (statsRes.data.success) {
        setContentStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await api.get('/ai/engagement-boosters');
      if (response.data.success) {
        setAiInsights(response.data.boosters);
      }
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };
  // Calculate dynamic stats
  const stats = [
    {
      label: 'Drafts Created',
      value: contentStats?.drafts?.draft || '0',
      change: '+12%',
      icon: FileText,
      color: 'purple'
    },
    {
      label: 'Scheduled Posts',
      value: contentStats?.scheduled?.scheduled || '0',
      change: '+25%',
      icon: Calendar,
      color: 'blue'
    },
    {
      label: 'AI Conversations',
      value: '156',
      change: '+8%',
      icon: MessageSquare,
      color: 'teal'
    },
    {
      label: 'Total Content',
      value: String((contentStats?.drafts?.draft || 0) + (contentStats?.scheduled?.scheduled || 0)),
      change: '+15%',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`transition-all duration-1000 ${showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user?.name || 'Creator'}! 👋
            </h1>
            <p className="text-gray-600 mt-2 animate-fadeInUp animation-delay-200">
              Here's what's happening with your content today.
            </p>
            {/* Achievement Badge */}
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 transition-all duration-1000 ${showWelcome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Content Creator Level: Pro ⭐
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-500 ${
                  showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p
                      ref={el => counterRefs.current[index] = el}
                      className="text-3xl font-bold text-gray-900 mt-2"
                    >
                      0
                    </p>
                    <div className={`text-sm mt-1 flex items-center ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`inline-block w-0 h-0 mr-1 transition-all duration-500 ${showStats ? 'w-2 h-2' : ''} ${
                        stat.change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'
                      } rounded-full`}></span>
                      {stat.change} from last week
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 transition-all duration-300 hover:scale-110`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600 transition-all duration-300`} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: showStats ? `${Math.min(parseInt(stat.value) * 10, 100)}%` : '0%',
                      transitionDelay: `${500 + index * 150}ms`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insights */}
        {user?.toneProfile && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h3 className="font-medium text-gray-900 mb-2">Your Voice</h3>
                <p className="text-sm text-gray-600 mb-2">Primary tone: <span className="font-medium capitalize">{user.toneProfile.primaryTone}</span></p>
                <p className="text-xs text-gray-500">{user.toneProfile.voiceDescription}</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h3 className="font-medium text-gray-900 mb-2">Today's Hook</h3>
                <p className="text-sm text-gray-600 italic">"{aiInsights?.hook || 'Loading...'}"</p>
                <button
                  onClick={fetchAIInsights}
                  className="text-xs text-purple-600 hover:text-purple-700 mt-2"
                >
                  Get new hook
                </button>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h3 className="font-medium text-gray-900 mb-2">Engagement Tip</h3>
                <p className="text-sm text-gray-600 italic">"{aiInsights?.cta || 'Loading...'}"</p>
                <button
                  onClick={fetchAIInsights}
                  className="text-xs text-purple-600 hover:text-purple-700 mt-2"
                >
                  Get new tip
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Drafts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Content</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentDrafts.map((draft) => (
                    <div key={draft.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            draft.platform === 'LinkedIn' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {draft.platform}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            draft.status === 'draft' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : draft.status === 'scheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {draft.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(draft.createdAt || draft.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-3 line-clamp-2">{draft.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>📝 {draft.metadata?.wordCount || 0} words</span>
                          <span>🔤 {draft.metadata?.characterCount || 0} chars</span>
                          {draft.metadata?.hashtags?.length > 0 && (
                            <span>🏷️ {draft.metadata.hashtags.length} tags</span>
                          )}
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ...existing code... */}
        </div>
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}