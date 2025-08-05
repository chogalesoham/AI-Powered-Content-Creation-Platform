import React, { useState } from 'react';
import { TrendingUp, Users, Heart, MessageCircle, Share, Calendar, BarChart3, Eye, Target, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import LineChart from '../components/LineChart';

// Static engagement data for line chart
const engagementData = [
  { date: '2024-07-01', value: 1250 },
  { date: '2024-07-03', value: 1420 },
  { date: '2024-07-05', value: 1180 },
  { date: '2024-07-07', value: 1650 },
  { date: '2024-07-09', value: 1890 },
  { date: '2024-07-11', value: 1720 },
  { date: '2024-07-13', value: 2100 },
  { date: '2024-07-15', value: 1950 },
  { date: '2024-07-17', value: 2340 },
  { date: '2024-07-19', value: 2180 },
  { date: '2024-07-21', value: 2560 },
  { date: '2024-07-23', value: 2420 },
  { date: '2024-07-25', value: 2780 },
  { date: '2024-07-27', value: 2650 },
  { date: '2024-07-29', value: 2890 },
  { date: '2024-07-31', value: 3120 }
];

// Key metrics data
const keyMetrics = [
  {
    title: 'Total Reach',
    value: '127.5K',
    change: '+23.4%',
    trend: 'up',
    icon: Eye,
    color: 'blue'
  },
  {
    title: 'Engagement Rate',
    value: '8.9%',
    change: '+2.1%',
    trend: 'up',
    icon: Heart,
    color: 'red'
  },
  {
    title: 'Click-Through Rate',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    icon: Target,
    color: 'green'
  },
  {
    title: 'Conversion Rate',
    value: '2.7%',
    change: '-0.3%',
    trend: 'down',
    icon: Zap,
    color: 'purple'
  }
];

const performanceData = [
  {
    platform: 'LinkedIn',
    posts: 24,
    totalEngagement: 3847,
    avgEngagement: 160,
    reach: 45200,
    impressions: 67800,
    clickRate: 4.8,
    topPost: {
      content: 'The biggest mistake I see founders make when hiring...',
      likes: 234,
      comments: 45,
      shares: 12,
      reach: 8900
    }
  },
  {
    platform: 'Twitter',
    posts: 18,
    totalEngagement: 2692,
    avgEngagement: 149,
    reach: 32100,
    impressions: 48600,
    clickRate: 3.2,
    topPost: {
      content: '🧵 5 productivity hacks that changed my life...',
      likes: 156,
      comments: 23,
      shares: 34,
      reach: 5600
    }
  },
  {
    platform: 'Instagram',
    posts: 15,
    totalEngagement: 1956,
    avgEngagement: 130,
    reach: 28400,
    impressions: 41200,
    clickRate: 2.9,
    topPost: {
      content: 'Behind the scenes of building our startup...',
      likes: 189,
      comments: 31,
      shares: 8,
      reach: 4200
    }
  }
];

const insights = [
  {
    title: 'Peak Engagement Hours',
    description: 'Your audience is most active Tuesday-Thursday 9-11 AM EST',
    impact: '+47% engagement',
    type: 'timing',
    priority: 'high'
  },
  {
    title: 'Content Performance Leader',
    description: 'Educational content outperforms promotional by 3.2x',
    impact: '+285% engagement',
    type: 'content',
    priority: 'high'
  },
  {
    title: 'Audience Growth Trend',
    description: 'Consistent 18% month-over-month follower growth',
    impact: '+2,340 followers',
    type: 'growth',
    priority: 'medium'
  },
  {
    title: 'Industry Benchmark',
    description: 'Your engagement rate exceeds industry average by 42%',
    impact: '8.9% vs 6.3%',
    type: 'performance',
    priority: 'high'
  },
  {
    title: 'Optimal Post Length',
    description: 'Posts with 150-200 words generate highest engagement',
    impact: '+31% interaction',
    type: 'optimization',
    priority: 'medium'
  },
  {
    title: 'Hashtag Strategy',
    description: '3-5 relevant hashtags increase reach by 67%',
    impact: '+12.4K reach',
    type: 'strategy',
    priority: 'medium'
  }
];

// Content performance by category
const contentCategories = [
  { name: 'Educational', posts: 18, engagement: 4250, rate: 9.2 },
  { name: 'Thought Leadership', posts: 15, engagement: 3890, rate: 8.7 },
  { name: 'Personal Stories', posts: 12, engagement: 2340, rate: 6.8 },
  { name: 'Company Updates', posts: 10, engagement: 1890, rate: 5.9 },
  { name: 'Product Features', posts: 8, engagement: 1560, rate: 5.2 }
];

const recentPosts = [
  {
    id: 1,
    platform: 'LinkedIn',
    content: 'Just shipped a major update to our platform! The feedback from beta users...',
    publishedAt: '2 days ago',
    likes: 89,
    comments: 12,
    shares: 5,
    engagementRate: 12.3
  },
  {
    id: 2,
    platform: 'Twitter',
    content: '🚀 Building in public update: We\'ve hit 1,000 users! Here\'s what we learned...',
    publishedAt: '4 days ago',
    likes: 156,
    comments: 23,
    shares: 34,
    engagementRate: 18.7
  },
  {
    id: 3,
    platform: 'LinkedIn',
    content: 'The biggest mistake I see startup founders make when raising...',
    publishedAt: '1 week ago',
    likes: 234,
    comments: 45,
    shares: 12,
    engagementRate: 22.1
  }
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your content performance and audience engagement</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="engagement">Engagement</option>
                <option value="reach">Reach</option>
                <option value="impressions">Impressions</option>
                <option value="clicks">Click Rate</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${metric.color}-100`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engagement Trends Chart */}
        <div className="mb-8">
          <LineChart
            data={engagementData}
            title="Engagement Trends Over Time"
            height={400}
            color="#8B5CF6"
            showGrid={true}
            showDots={true}
            animate={true}
          />
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {performanceData.map((platform, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{platform.platform}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  platform.platform === 'LinkedIn'
                    ? 'bg-blue-100 text-blue-800'
                    : platform.platform === 'Twitter'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-pink-100 text-pink-800'
                }`}>
                  {platform.posts} posts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{platform.totalEngagement.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{platform.reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Reach</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{platform.avgEngagement}</p>
                  <p className="text-xs text-gray-600">Avg Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{platform.clickRate}%</p>
                  <p className="text-xs text-gray-600">Click Rate</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Top Post</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{platform.topPost.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {platform.topPost.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {platform.topPost.comments}
                    </span>
                  </div>
                  <span className="text-purple-600 font-medium">{platform.topPost.reach.toLocaleString()} reach</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance by Category</h3>
            <div className="space-y-4">
              {contentCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className="text-sm font-semibold text-purple-600">{category.rate}%</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{category.posts} posts</span>
                      <span className="mx-2">•</span>
                      <span>{category.engagement.toLocaleString()} engagement</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(category.rate / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
            </div>

            <div className="space-y-4">
              {insights.slice(0, 4).map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <div className="flex items-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        insight.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                    {insight.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Posts Performance</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time tracking</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        post.platform === 'LinkedIn'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {post.platform}
                      </span>
                      <span className="text-sm text-gray-500">{post.publishedAt}</span>
                    </div>
                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">{post.engagementRate}%</span>
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4 line-clamp-2 font-medium">{post.content}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-center p-3 bg-red-50 rounded-lg">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{post.likes}</p>
                        <p className="text-xs text-gray-600">Likes</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{post.comments}</p>
                        <p className="text-xs text-gray-600">Comments</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                      <Share className="w-4 h-4 mr-2 text-green-500" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{post.shares}</p>
                        <p className="text-xs text-gray-600">Shares</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{(post.likes + post.comments + post.shares)}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}