import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';

interface SignupProps {
  onSignup?: (userData: any) => void;
}

export default function Signup({ onSignup }: SignupProps) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      if (onSignup) {
        onSignup({});
      }
      // Redirect to login page after successful signup
      navigate('/login', {
        state: {
          message: 'Account created successfully! Please log in with your credentials.',
          email: formData.email
        }
      });
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden bg-gradient-animated">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Floating Particles */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-purple-400 rounded-full animate-float animation-delay-200"></div>
        <div className="absolute top-24 right-24 w-1 h-1 bg-blue-400 rounded-full animate-float animation-delay-400"></div>
        <div className="absolute bottom-16 left-24 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-300"></div>
        <div className="absolute bottom-24 right-16 w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-250"></div>
        <div className="absolute top-1/4 right-8 w-1 h-1 bg-pink-400 rounded-full animate-float animation-delay-350"></div>
        <div className="absolute top-3/4 left-12 w-2 h-2 bg-purple-400 rounded-full animate-float animation-delay-450"></div>
      </div>

      {/* Animated Network Background */}
      <div className="network-bg">
        <svg viewBox="0 0 1200 800" className="absolute inset-0">
          {/* Network Lines - Different pattern from login */}
          <line x1="120" y1="80" x2="320" y2="180" className="network-line" style={{animationDelay: '0.2s'}} />
          <line x1="320" y1="180" x2="520" y2="130" className="network-line" style={{animationDelay: '0.7s'}} />
          <line x1="520" y1="130" x2="720" y2="230" className="network-line" style={{animationDelay: '1.2s'}} />
          <line x1="720" y1="230" x2="920" y2="160" className="network-line" style={{animationDelay: '1.7s'}} />
          <line x1="180" y1="420" x2="380" y2="370" className="network-line" style={{animationDelay: '2.2s'}} />
          <line x1="380" y1="370" x2="580" y2="420" className="network-line" style={{animationDelay: '2.7s'}} />
          <line x1="580" y1="420" x2="780" y2="370" className="network-line" style={{animationDelay: '3.2s'}} />
          <line x1="130" y1="620" x2="330" y2="570" className="network-line" style={{animationDelay: '3.7s'}} />
          <line x1="330" y1="570" x2="530" y2="620" className="network-line" style={{animationDelay: '4.2s'}} />
          <line x1="530" y1="620" x2="730" y2="570" className="network-line" style={{animationDelay: '4.7s'}} />

          {/* Connecting diagonal lines */}
          <line x1="320" y1="180" x2="180" y2="420" className="network-line" style={{animationDelay: '1.2s'}} />
          <line x1="520" y1="130" x2="380" y2="370" className="network-line" style={{animationDelay: '2.2s'}} />
          <line x1="720" y1="230" x2="580" y2="420" className="network-line" style={{animationDelay: '3.2s'}} />
          <line x1="380" y1="370" x2="330" y2="570" className="network-line" style={{animationDelay: '2.7s'}} />
          <line x1="580" y1="420" x2="530" y2="620" className="network-line" style={{animationDelay: '3.7s'}} />

          {/* Network Nodes */}
          <circle cx="120" cy="80" r="3" className="network-node" style={{animationDelay: '0.2s'}} />
          <circle cx="320" cy="180" r="4" className="network-node" style={{animationDelay: '0.7s'}} />
          <circle cx="520" cy="130" r="3" className="network-node" style={{animationDelay: '1.2s'}} />
          <circle cx="720" cy="230" r="4" className="network-node" style={{animationDelay: '1.7s'}} />
          <circle cx="920" cy="160" r="3" className="network-node" style={{animationDelay: '2.2s'}} />
          <circle cx="180" cy="420" r="4" className="network-node" style={{animationDelay: '2.7s'}} />
          <circle cx="380" cy="370" r="5" className="network-node" style={{animationDelay: '3.2s'}} />
          <circle cx="580" cy="420" r="4" className="network-node" style={{animationDelay: '3.7s'}} />
          <circle cx="780" cy="370" r="3" className="network-node" style={{animationDelay: '4.2s'}} />
          <circle cx="130" cy="620" r="4" className="network-node" style={{animationDelay: '4.7s'}} />
          <circle cx="330" cy="570" r="5" className="network-node" style={{animationDelay: '5.2s'}} />
          <circle cx="530" cy="620" r="4" className="network-node" style={{animationDelay: '5.7s'}} />
          <circle cx="730" cy="570" r="3" className="network-node" style={{animationDelay: '6.2s'}} />
        </svg>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-slideInUp hover:shadow-3xl transition-all duration-500 hover:bg-white/90">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fadeInDown">Create Account</h2>
            <p className="text-gray-600 animate-fadeInUp animation-delay-200">Join ContentAI and start creating amazing content</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake shadow-sm">
              <p className="text-red-600 text-sm animate-fadeIn">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slideInLeft animation-delay-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 focus:scale-105"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="animate-slideInRight animation-delay-350">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 focus:scale-105"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="animate-slideInLeft animation-delay-400">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 focus:scale-105"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="animate-slideInRight animation-delay-450">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 focus:scale-105"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-all duration-200 hover:scale-110"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg animate-slideInUp animation-delay-500 active:scale-95"
            >
              <span className={`inline-flex items-center ${loading ? 'animate-pulse' : ''}`}>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
