import React from 'react';
import { TrendingUp, Users, Heart, MessageCircle, Share, Calendar } from 'lucide-react';

const performanceData = [
  {
    platform: 'LinkedIn',
    posts: 12,
    totalEngagement: 1847,
    avgEngagement: 154,
    topPost: {
      content: 'The biggest mistake I see founders make when hiring...',
      likes: 234,
      comments: 45,
      shares: 12
    }
  },
  {
    platform: 'Twitter',
    posts: 8,
    totalEngagement: 692,
    avgEngagement: 87,
    topPost: {
      content: '🧵 5 productivity hacks that changed my life...',
      likes: 156,
      comments: 23,
      shares: 34
    }
  }
];

const insights = [
  {
    title: 'Best Posting Time',
    description: 'Your audience is most active on Tuesday 9-10 AM',
    impact: '+40% engagement',
    type: 'timing'
  },
  {
    title: 'Top Performing Content',
    description: 'Thought leadership posts drive 3x more engagement',
    impact: '234% increase',
    type: 'content'
  },
  {
    title: 'Audience Growth',
    description: 'LinkedIn followers grew by 15% this month',
    impact: '+127 followers',
    type: 'growth'
  },
  {
    title: 'Engagement Rate',
    description: 'Your engagement rate is 40% above industry average',
    impact: '8.9% vs 6.3%',
    type: 'performance'
  }
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
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Track your content performance and discover optimization opportunities</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {performanceData.map((platform, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{platform.platform} Performance</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  platform.platform === 'LinkedIn'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {platform.posts} posts
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{platform.totalEngagement.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{platform.avgEngagement}</p>
                  <p className="text-sm text-gray-600">Avg per Post</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">+15%</p>
                  <p className="text-sm text-gray-600">vs Last Month</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Top Performing Post</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{platform.topPost.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {platform.topPost.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {platform.topPost.comments}
                  </span>
                  <span className="flex items-center">
                    <Share className="w-4 h-4 mr-1" />
                    {platform.topPost.shares}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                    {insight.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Posts Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.platform === 'LinkedIn'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.platform}
                      </span>
                      <span className="text-sm text-gray-500">{post.publishedAt}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">{post.engagementRate}%</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      {post.likes}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
                      {post.comments}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Share className="w-4 h-4 mr-1 text-green-500" />
                      {post.shares}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1 text-purple-500" />
                      {(post.likes + post.comments + post.shares)} total
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