# AI-Powered Content Creation Platform

A comprehensive web application that uses AI to help influencers and brands create tailored, platform-specific social media content for LinkedIn and Twitter/X. The platform features a conversational AI interface, tone analysis, and automated content generation while maintaining full user control over publishing.

## 🚀 Features

### Core Functionality
- **Conversational AI Interface**: Chat-based content creation with GPT integration
- **Tone Analysis**: AI analyzes past posts to capture user's unique voice and style
- **Platform-Specific Optimization**: Content tailored for LinkedIn and Twitter/X
- **Scheduled Content Generation**: Automated draft creation based on user schedules
- **Template Library**: High-performing post formats with AI-powered suggestions
- **Manual Review System**: No auto-posting - users maintain full control

### AI-Powered Features
- **Smart Content Generation**: Context-aware content creation based on user profile
- **Tone Matching**: Maintains consistent brand voice across all content
- **Engagement Optimization**: AI-driven suggestions for better performance
- **Content Ideas**: Personalized suggestions based on niche and goals
- **Performance Analytics**: AI insights and recommendations

### User Experience
- **Onboarding Flow**: Comprehensive setup for personalized experience
- **Authentication System**: Secure login/signup with JWT tokens
- **Dashboard**: Overview of content performance and AI insights
- **Settings**: Detailed customization of AI behavior and preferences

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for navigation
- **State Management**: Context API for authentication
- **Icons**: Lucide React for consistent iconography

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Environment**: dotenv for configuration management

### AI/ML Services
- **OpenAI Integration**: GPT-3.5-turbo for content generation
- **Tone Analysis**: Custom algorithms + AI-powered analysis
- **Content Optimization**: Platform-specific formatting and suggestions
- **Scheduled Generation**: Automated content creation workflows

## 📁 Project Structure

```
project/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── contexts/       # React contexts (Auth)
│   │   └── api.ts          # API client configuration
│   └── package.json
├── backend/                 # Node.js Express backend
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB data models
│   ├── middleware/         # Custom middleware (auth)
│   └── server.js           # Main server file
├── AIML/                   # AI/ML services
│   ├── services/           # Core AI services
│   │   ├── openaiService.js    # OpenAI integration
│   │   ├── toneAnalyzer.js     # Tone analysis
│   │   └── contentGenerator.js # Content generation
│   ├── utils/              # AI utilities and helpers
│   └── index.js            # Main AIML module
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key (optional, for full AI features)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Demo Account

For testing purposes, use these credentials:
- **Email**: demo@contentai.com
- **Password**: demo123

The demo account comes pre-configured with:
- Sample user profile (SaaS founder)
- Tone analysis results
- Platform preferences (LinkedIn, Twitter)
- Content goals (Brand Awareness, Thought Leadership)

## 🎯 Key Pages & Features

### 1. Authentication
- **Login/Signup**: Secure authentication with form validation
- **Onboarding**: 4-step process to capture user preferences and analyze tone

### 2. Dashboard
- **Overview**: Content statistics and performance metrics
- **AI Insights**: Personalized recommendations and engagement tips
- **Recent Activity**: Latest drafts and scheduled content

### 3. Content Chat
- **AI Assistant**: Conversational interface for content creation
- **Platform Selection**: Generate content for specific platforms
- **Real-time Suggestions**: Multiple content variations with engagement scores

### 4. Templates
- **Template Library**: Proven post formats for different content types
- **AI-Generated Ideas**: Personalized content suggestions based on user niche
- **Quick Actions**: One-click content generation prompts

### 5. Schedule
- **Content Calendar**: View and manage scheduled posts
- **Recurring Schedules**: Automated content generation workflows
- **AI Generation**: On-demand content creation for scheduled slots

### 6. Settings
- **Profile Management**: Update user information and preferences
- **AI Configuration**: Customize AI behavior and content preferences
- **Tone Profile**: View and manage AI-analyzed writing style

## 🤖 AI Integration

### OpenAI Services
- **Content Generation**: Context-aware post creation
- **Tone Analysis**: Voice and style pattern recognition
- **Content Ideas**: Niche-specific topic suggestions
- **Engagement Optimization**: Performance-driven recommendations

### Custom AI Features
- **Template Matching**: Intelligent template suggestions
- **Platform Optimization**: Format-specific content adaptation
- **Scheduled Generation**: Automated content workflows
- **Performance Analytics**: AI-driven insights and recommendations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### AI Services
- `POST /api/ai/generate-content` - Generate content
- `POST /api/ai/analyze-tone` - Analyze writing tone
- `POST /api/ai/content-suggestions` - Get content suggestions
- `POST /api/ai/content-ideas` - Generate content ideas
- `POST /api/ai/scheduled-content` - Generate scheduled content
- `GET /api/ai/engagement-boosters` - Get engagement tips

## 🚦 Getting Started

1. **Clone the repository**
2. **Set up the backend** (see Backend Setup above)
3. **Set up the frontend** (see Frontend Setup above)
4. **Access the application** at `http://localhost:5173`
5. **Sign up or use the demo account** to explore features
6. **Complete onboarding** to personalize your AI experience
7. **Start creating content** using the chat interface or templates

## 🔮 Future Enhancements

- **Multi-platform Support**: Instagram, TikTok, Facebook integration
- **Advanced Analytics**: Detailed performance tracking and insights
- **Team Collaboration**: Multi-user accounts and content approval workflows
- **Content Calendar**: Visual calendar interface with drag-and-drop scheduling
- **API Integration**: Direct publishing to social media platforms
- **Advanced AI Models**: Fine-tuned models for specific industries

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the GitHub repository.
