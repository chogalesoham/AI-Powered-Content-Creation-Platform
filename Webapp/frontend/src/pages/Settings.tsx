import React, { useState } from 'react';
import { User, Bell, Shield, Zap, Save, LogOut, Camera, Globe, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsProps {
  user: any;
  setUser: (user: any) => void;
}

export default function ProfileSettings({ user, setUser }: SettingsProps) {
  const { logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    role: user?.role || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    platforms: user?.platforms || [],
    niche: user?.niche || '',
    tone: user?.tone || '',
    goals: user?.goals || [],
    postFrequency: user?.postFrequency || 'weekly',
    preferences: {
      defaultPlatform: user?.preferences?.defaultPlatform || 'linkedin',
      autoAnalyzeTone: user?.preferences?.autoAnalyzeTone ?? true,
      contentLength: user?.preferences?.contentLength || 'medium',
      includeHashtags: user?.preferences?.includeHashtags ?? true,
      timezone: user?.preferences?.timezone || 'UTC',
      language: user?.preferences?.language || 'en'
    },
    notifications: {
      email: true,
      push: false,
      contentReady: true,
      weeklyReport: true,
      aiSuggestions: true,
      performanceAlerts: false
    },
    privacy: {
      analyticsSharing: false,
      contentSuggestions: true,
      dataExport: true,
      profileVisibility: 'private'
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'ai', name: 'AI Preferences', icon: Zap }
  ];

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      await updateUser(formData);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-600">Upload a professional photo to personalize your profile</p>
          <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
            Change Photo
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="your.email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Your job title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <div className="relative">
              <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
          placeholder="Write a brief professional bio that describes your expertise and what you do..."
        />
        <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X Profile</label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>
      </div>

      {/* Content Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Niche</label>
            <select
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="">Select your primary niche</option>
              <option value="Technology">Technology & Software</option>
              <option value="Business">Business & Entrepreneurship</option>
              <option value="Marketing">Marketing & Sales</option>
              <option value="Finance">Finance & Investment</option>
              <option value="Healthcare">Healthcare & Wellness</option>
              <option value="Education">Education & Training</option>
              <option value="Lifestyle">Lifestyle & Personal Development</option>
              <option value="Design">Design & Creativity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Professional', 'Casual', 'Inspirational', 'Educational', 'Humorous', 'Authoritative'].map((tone) => (
                <label key={tone} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={formData.tone === tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="mr-3 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{tone}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Goals</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Brand Awareness', 'Lead Generation', 'Thought Leadership', 'Community Building', 'Product Promotion', 'Education'].map((goal) => (
                <label key={goal} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.goals, goal]
                        : formData.goals.filter(g => g !== goal);
                      setFormData({ ...formData, goals });
                    }}
                    className="mr-3 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Active Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['LinkedIn', 'Twitter/X', 'Instagram', 'TikTok', 'Facebook', 'YouTube'].map((platform) => (
                <label key={platform} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      const platforms = e.target.checked
                        ? [...formData.platforms, platform]
                        : formData.platforms.filter(p => p !== platform);
                      setFormData({ ...formData, platforms });
                    }}
                    className="mr-3 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.email}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, email: e.target.checked }
              })}
              className="text-purple-600 focus:ring-purple-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">Get notified in your browser</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.push}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, push: e.target.checked }
              })}
              className="text-purple-600 focus:ring-purple-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Content Ready</p>
              <p className="text-sm text-gray-600">When AI generates new content drafts</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.contentReady}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, contentReady: e.target.checked }
              })}
              className="text-purple-600 focus:ring-purple-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Weekly Report</p>
              <p className="text-sm text-gray-600">Performance summary every week</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.weeklyReport}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, weeklyReport: e.target.checked }
              })}
              className="text-purple-600 focus:ring-purple-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy & Security Settings</h3>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Data & Analytics</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Analytics Sharing</p>
                  <p className="text-sm text-gray-600">Allow anonymous usage analytics to improve the platform</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.analyticsSharing}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, analyticsSharing: e.target.checked }
                  })}
                  className="text-purple-600 focus:ring-purple-500 h-5 w-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Content Suggestions</p>
                  <p className="text-sm text-gray-600">Use your content history to provide personalized suggestions</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.contentSuggestions}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, contentSuggestions: e.target.checked }
                  })}
                  className="text-purple-600 focus:ring-purple-500 h-5 w-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Data Export</p>
                  <p className="text-sm text-gray-600">Allow exporting your data and content history</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.dataExport}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, dataExport: e.target.checked }
                  })}
                  className="text-purple-600 focus:ring-purple-500 h-5 w-5"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Profile Visibility</h4>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={formData.privacy.profileVisibility === 'private'}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, profileVisibility: e.target.value }
                  })}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Private</p>
                  <p className="text-sm text-gray-600">Only you can see your profile and content</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={formData.privacy.profileVisibility === 'public'}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, profileVisibility: e.target.value }
                  })}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Public</p>
                  <p className="text-sm text-gray-600">Your profile is visible to other users</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Data Security</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );





  const renderAITab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Content Generation</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Platform</label>
            <select
              value={formData.preferences.defaultPlatform}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, defaultPlatform: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Length Preference</label>
            <select
              value={formData.preferences.contentLength}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, contentLength: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="short">Short (concise posts)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="long">Long (detailed posts)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-analyze tone from past posts</label>
              <p className="text-xs text-gray-500">Automatically update your tone profile when you add past posts</p>
            </div>
            <input
              type="checkbox"
              checked={formData.preferences.autoAnalyzeTone}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, autoAnalyzeTone: e.target.checked }
              })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Include hashtags in generated content</label>
              <p className="text-xs text-gray-500">Automatically add relevant hashtags to posts</p>
            </div>
            <input
              type="checkbox"
              checked={formData.preferences.includeHashtags}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, includeHashtags: e.target.checked }
              })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {user?.toneProfile && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Your AI Tone Profile</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Primary Tone:</span>
              <span className="font-medium capitalize">{user.toneProfile.primaryTone}</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="font-medium">{Math.round((user.toneProfile.confidence || 0) * 100)}%</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">Voice Description:</span>
              <p className="text-xs mt-1">{user.toneProfile.voiceDescription}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">AI Performance Metrics</h4>
        <div className="space-y-2 text-sm text-purple-800">
          <div className="flex justify-between">
            <span>Content Generated:</span>
            <span className="font-medium">47 posts</span>
          </div>
          <div className="flex justify-between">
            <span>Avg. Engagement Score:</span>
            <span className="font-medium">85%</span>
          </div>
          <div className="flex justify-between">
            <span>Brand Voice Match:</span>
            <span className="font-medium">92%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'ai':
        return renderAITab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account configuration</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              
              {renderTabContent()}
              
              {/* Messages */}
              {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}