import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, User, Target, Palette, Clock } from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

type UserData = {
  name: string;
  company: string;
  role: string;
  platforms: string[];
  niche: string;
  tone: string;
  goals: string[];
  pastPosts: string;
  postFrequency: string;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    company: '',
    role: '',
    platforms: [],
    niche: '',
    tone: '',
    goals: [],
    pastPosts: '',
    postFrequency: 'weekly'
  });

  const steps = [
    {
      title: 'Welcome to ContentAI',
      subtitle: 'Let\'s personalize your content creation experience',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company/Brand</label>
            <input
              type="text"
              value={userData.company}
              onChange={(e) => setUserData({ ...userData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your company or personal brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select your role</option>
              <option value="founder">Founder/CEO</option>
              <option value="marketer">Marketing Manager</option>
              <option value="influencer">Influencer</option>
              <option value="creator">Content Creator</option>
              <option value="consultant">Consultant</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Choose Your Platforms',
      subtitle: 'Select the platforms where you create content',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {['LinkedIn', 'Twitter/X', 'Instagram', 'TikTok'].map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  const platforms = userData.platforms.includes(platform)
                    ? userData.platforms.filter(p => p !== platform)
                    : [...userData.platforms, platform];
                  setUserData({ ...userData, platforms });
                }}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  userData.platforms.includes(platform)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="font-medium">{platform}</div>
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Niche/Industry</label>
            <input
              type="text"
              value={userData.niche}
              onChange={(e) => setUserData({ ...userData, niche: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., SaaS, Marketing, Personal Development"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Define Your Voice',
      subtitle: 'Help us understand your content style and tone',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {['Professional', 'Casual', 'Inspirational', 'Educational', 'Humorous', 'Authoritative'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setUserData({ ...userData, tone })}
                  className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                    userData.tone === tone
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Goals</label>
            <div className="space-y-2">
              {['Brand Awareness', 'Lead Generation', 'Thought Leadership', 'Community Building', 'Product Promotion'].map((goal) => (
                <label key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userData.goals.includes(goal)}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...userData.goals, goal]
                        : userData.goals.filter(g => g !== goal);
                      setUserData({ ...userData, goals });
                    }}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Upload Past Content',
      subtitle: 'Share some of your previous posts so our AI can learn your style',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Your Recent Posts (Optional)
            </label>
            <textarea
              value={userData.pastPosts}
              onChange={(e) => setUserData({ ...userData, pastPosts: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Paste 3-5 of your recent posts here. This helps our AI understand your writing style and voice."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Posting Frequency</label>
            <select
              value={userData.postFrequency}
              onChange={(e) => setUserData({ ...userData, postFrequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      setError('');
      try {
        // Update user profile with onboarding data
        await updateUser(userData);
        onComplete(userData);
      } catch (err: any) {
        setError(err.message || 'Onboarding failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return userData.name && userData.company && userData.role;
      case 1:
        return userData.platforms.length > 0 && userData.niche;
      case 2:
        return userData.tone && userData.goals.length > 0;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading && <div className="text-center text-purple-600 mb-4">Setting up your account...</div>}
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round((currentStep + 1) / steps.length * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.subtitle}</p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || loading}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentStep === steps.length - 1 ? (loading ? 'Setting up...' : 'Get Started') : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}