import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Copy, Eye, Sparkles, Wand2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const templates = [
  {
    id: 1,
    title: 'Milestone Announcement',
    description: 'Celebrate company achievements and milestones',
    category: 'Company Updates',
    platform: 'LinkedIn',
    engagement: 'High',
    preview: `🚀 Excited to share a major milestone: We've just hit [NUMBER] [METRIC]!\n\nWhen we started [COMPANY] [TIME] ago, this felt like a distant dream. Today, it's reality.\n\nHere's what this taught me:\n• [LESSON 1]\n• [LESSON 2]\n• [LESSON 3]\n\nTo our incredible [AUDIENCE]: thank you for believing in our vision.\n\n#StartupJourney #Milestone`,
    likes: 1240,
    uses: 89
  },
  {
    id: 2,
    title: 'Thought Leadership',
    description: 'Share industry insights and expert opinions',
    category: 'Thought Leadership',
    platform: 'LinkedIn',
    engagement: 'Very High',
    preview: `The biggest mistake I see [TARGET] make?\n\nThey focus on [WRONG APPROACH], not [RIGHT APPROACH].\n\nLast week, I [PERSONAL ANECDOTE]. Here's what I learned:\n\n[INSIGHT 1]\n[INSIGHT 2]\n[INSIGHT 3]\n\nThe shift? From [OLD WAY] to [NEW WAY].\n\nWhat's your experience with this?`,
    likes: 2103,
    uses: 156
  },
  {
    id: 3,
    title: 'Behind the Scenes',
    description: 'Show the human side of your business',
    category: 'Personal',
    platform: 'LinkedIn',
    engagement: 'Medium',
    preview: `A day in the life of a [ROLE]:\n\n6:30 AM - [MORNING ROUTINE]\n8:00 AM - [WORK ACTIVITY]\n10:00 AM - [MEETINGS/CALLS]\n2:00 PM - [CORE WORK]\n4:00 PM - [TEAM TIME]\n6:00 PM - [WRAP UP]\n\nBuilding [COMPANY] isn't just about the end result. It's about enjoying the journey.\n\nWhat does your typical day look like?`,
    likes: 567,
    uses: 43
  },
  {
    id: 4,
    title: 'Quick Tip Thread',
    description: 'Share bite-sized valuable insights',
    category: 'Educational',
    platform: 'Twitter',
    engagement: 'High',
    preview: `🧵 [NUMBER] [TOPIC] tips that will [BENEFIT]:\n\n1/ [TIP 1 - KEY POINT]\n\n2/ [TIP 2 - KEY POINT]\n\n3/ [TIP 3 - KEY POINT]\n\n4/ [TIP 4 - KEY POINT]\n\n5/ [TIP 5 - KEY POINT]\n\nWhich tip resonated most with you?`,
    likes: 892,
    uses: 234
  },
  {
    id: 5,
    title: 'Product Launch',
    description: 'Announce new features or products',
    category: 'Product',
    platform: 'Twitter',
    engagement: 'High',
    preview: `🎉 [PRODUCT/FEATURE] is now live!\n\nAfter [TIME PERIOD] of building, we're excited to share [MAIN BENEFIT].\n\n✨ What's new:\n• [FEATURE 1]\n• [FEATURE 2]\n• [FEATURE 3]\n\nTry it now: [LINK]\n\nWould love your feedback! 👇`,
    likes: 445,
    uses: 67
  },
  {
    id: 6,
    title: 'Industry Commentary',
    description: 'React to news and trends in your industry',
    category: 'Thought Leadership',
    platform: 'LinkedIn',
    engagement: 'Very High',
    preview: `Hot take on [RECENT NEWS/TREND]:\n\nEveryone's talking about [SURFACE LEVEL OBSERVATION], but they're missing the real story.\n\nHere's what's actually happening:\n\n1. [DEEPER INSIGHT 1]\n2. [DEEPER INSIGHT 2]\n3. [DEEPER INSIGHT 3]\n\nThis will impact [AUDIENCE] because [REASON].\n\nMy prediction: [FUTURE OUTCOME]\n\nThoughts?`,
    likes: 1876,
    uses: 134
  }
];

const categories = ['All', 'Company Updates', 'Thought Leadership', 'Personal', 'Educational', 'Product'];
const platforms = ['All', 'LinkedIn', 'Twitter'];

export default function Templates() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'All' || template.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const toggleFavorite = (templateId: number) => {
    setFavorites(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const useTemplate = (template: any) => {
    // In a real app, this would navigate to the editor or create a new draft
    console.log('Using template:', template.title);
  };

  useEffect(() => {
    if (user?.niche && user?.goals) {
      generateAIContentIdeas();
    }
  }, [user]);

  const generateAIContentIdeas = async () => {
    if (!user?.niche || !user?.goals) return;

    setLoadingAI(true);
    try {
      const response = await api.post('/ai/content-ideas', {
        niche: user.niche,
        goals: user.goals,
        count: 5
      });

      if (response.data.success) {
        setAiSuggestions(response.data.ideas);
      }
    } catch (error) {
      console.error('Failed to generate AI content ideas:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const categories = ['All', 'Company Updates', 'Thought Leadership', 'Personal', 'Educational', 'Product'];
  const platforms = ['All', 'LinkedIn', 'Twitter', 'Instagram'];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Templates</h1>
          <p className="text-gray-600">High-performing post formats proven to drive engagement</p>
        </div>

        {/* AI Content Ideas */}
        {user?.niche && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">AI Content Ideas for {user.niche}</h2>
              </div>
              <button
                onClick={generateAIContentIdeas}
                disabled={loadingAI}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {loadingAI ? 'Generating...' : 'Generate New Ideas'}
              </button>
            </div>

            {loadingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-purple-600">Generating personalized content ideas...</span>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiSuggestions.map((idea: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">{idea.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {idea.platform}
                      </span>
                      <button
                        onClick={() => useTemplate(idea)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Use Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Click "Generate New Ideas" to get personalized content suggestions based on your niche and goals.</p>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.title}</h3>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(template.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(template.id)
                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.platform === 'LinkedIn'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.platform}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.engagement === 'Very High'
                      ? 'bg-green-100 text-green-800'
                      : template.engagement === 'High'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.engagement} Engagement
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Preview</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-6">
                    {template.preview}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👍 {template.likes.toLocaleString()}</span>
                    <span>📝 {template.uses} uses</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(template.preview)}
                      className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => useTemplate(template)}
                      className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}