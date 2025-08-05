# Backend and ML Model Implementation Guide

## Architecture Overview

```
Frontend (React) ↔ API Gateway ↔ Backend Services ↔ ML Models ↔ Database
```

## Backend Stack Recommendation

### Core Technologies
- **Framework**: Node.js with Express.js or Python with FastAPI
- **Database**: PostgreSQL for structured data + Redis for caching
- **Authentication**: JWT tokens with refresh token rotation
- **File Storage**: AWS S3 or Google Cloud Storage
- **Queue System**: Redis Bull Queue or AWS SQS
- **Monitoring**: Winston (Node.js) or Python logging

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(100),
    niche VARCHAR(255),
    tone VARCHAR(100),
    platforms TEXT[], -- Array of platforms
    goals TEXT[], -- Array of goals
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User posts for tone analysis
CREATE TABLE user_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    engagement_metrics JSONB, -- likes, comments, shares
    posted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Generated content drafts
CREATE TABLE content_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(100), -- thought_leadership, milestone, etc.
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, published
    scheduled_for TIMESTAMP,
    ai_confidence_score FLOAT,
    engagement_prediction JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recurring schedules
CREATE TABLE recurring_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- weekly, biweekly, monthly
    day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
    time_of_day TIME NOT NULL,
    active BOOLEAN DEFAULT true,
    last_generated TIMESTAMP,
    next_generation TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content templates
CREATE TABLE content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    template_content TEXT NOT NULL,
    engagement_rating VARCHAR(20), -- high, medium, low
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User tone analysis results
CREATE TABLE tone_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    analysis_data JSONB NOT NULL, -- tone characteristics, keywords, style
    confidence_score FLOAT,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Structure

### Authentication
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### User Management
```javascript
GET /api/users/profile
PUT /api/users/profile
POST /api/users/onboarding
GET /api/users/tone-analysis
POST /api/users/analyze-posts
```

### Content Generation
```javascript
POST /api/content/generate
GET /api/content/drafts
PUT /api/content/drafts/:id
DELETE /api/content/drafts/:id
POST /api/content/schedule
```

### Templates
```javascript
GET /api/templates
GET /api/templates/:id
POST /api/templates/use/:id
```

### Scheduling
```javascript
GET /api/schedules/posts
POST /api/schedules/posts
PUT /api/schedules/posts/:id
DELETE /api/schedules/posts/:id
GET /api/schedules/recurring
POST /api/schedules/recurring
PUT /api/schedules/recurring/:id
DELETE /api/schedules/recurring/:id
```

### Analytics
```javascript
GET /api/analytics/dashboard
GET /api/analytics/performance
GET /api/analytics/insights
```

## ML Model Implementation

### 1. Tone Analysis Model

**Purpose**: Analyze user's past posts to extract writing style, tone, and voice characteristics.

**Implementation Options**:

#### Option A: Fine-tuned BERT Model
```python
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import numpy as np

class ToneAnalyzer:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.model = BertForSequenceClassification.from_pretrained(
            'bert-base-uncased', 
            num_labels=6  # professional, casual, inspirational, etc.
        )
    
    def analyze_posts(self, posts):
        """Analyze multiple posts to determine user's tone profile"""
        tone_scores = []
        
        for post in posts:
            inputs = self.tokenizer(
                post, 
                return_tensors='pt', 
                truncation=True, 
                padding=True, 
                max_length=512
            )
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
                tone_scores.append(probabilities.numpy())
        
        # Aggregate scores across all posts
        avg_scores = np.mean(tone_scores, axis=0)
        
        return {
            'primary_tone': self.get_tone_label(np.argmax(avg_scores)),
            'tone_distribution': avg_scores.tolist(),
            'confidence': float(np.max(avg_scores))
        }
    
    def get_tone_label(self, index):
        labels = ['professional', 'casual', 'inspirational', 'educational', 'humorous', 'authoritative']
        return labels[index]
```

#### Option B: OpenAI GPT-based Analysis
```python
import openai
import json

class GPTToneAnalyzer:
    def __init__(self, api_key):
        openai.api_key = api_key
    
    def analyze_posts(self, posts):
        """Use GPT to analyze writing style and tone"""
        posts_text = "\n\n---\n\n".join(posts[:10])  # Limit to 10 posts
        
        prompt = f"""
        Analyze the following social media posts and determine the author's writing style and tone characteristics:

        {posts_text}

        Please provide a JSON response with:
        1. primary_tone (professional, casual, inspirational, educational, humorous, authoritative)
        2. writing_style_keywords (array of descriptive words)
        3. common_phrases (frequently used expressions)
        4. sentence_structure (short/long, simple/complex)
        5. emoji_usage (frequency and style)
        6. confidence_score (0-1)
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        return json.loads(response.choices[0].message.content)
```

### 2. Content Generation Model

**Purpose**: Generate platform-specific content based on user's tone and requirements.

```python
class ContentGenerator:
    def __init__(self, openai_api_key):
        openai.api_key = openai_api_key
    
    def generate_content(self, user_profile, content_request):
        """Generate content based on user profile and request"""
        
        tone_profile = user_profile.get('tone_analysis', {})
        
        system_prompt = f"""
        You are an AI content creator specializing in {user_profile['platform']} posts.
        
        User Profile:
        - Name: {user_profile['name']}
        - Company: {user_profile['company']}
        - Role: {user_profile['role']}
        - Niche: {user_profile['niche']}
        - Primary Tone: {tone_profile.get('primary_tone', 'professional')}
        - Writing Style: {', '.join(tone_profile.get('writing_style_keywords', []))}
        - Common Phrases: {', '.join(tone_profile.get('common_phrases', []))}
        
        Platform Guidelines:
        - LinkedIn: Professional, longer form, industry insights, personal stories
        - Twitter: Concise, engaging, thread-friendly, trending topics
        
        Generate content that matches the user's authentic voice and style.
        """
        
        user_prompt = f"""
        Create a {user_profile['platform']} post about: {content_request['topic']}
        
        Content Type: {content_request['content_type']}
        Target Audience: {user_profile['niche']} professionals
        
        Requirements:
        - Match the user's tone and writing style
        - Include relevant hashtags
        - Optimize for engagement
        - Keep platform character limits in mind
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        return {
            'content': response.choices[0].message.content,
            'platform': user_profile['platform'],
            'estimated_engagement': self.predict_engagement(response.choices[0].message.content, user_profile)
        }
    
    def predict_engagement(self, content, user_profile):
        """Predict engagement based on content characteristics"""
        # Simplified engagement prediction
        score = 0.5  # Base score
        
        # Adjust based on content length
        if user_profile['platform'] == 'LinkedIn' and len(content) > 500:
            score += 0.1
        elif user_profile['platform'] == 'Twitter' and len(content) < 280:
            score += 0.1
        
        # Adjust based on hashtags
        hashtag_count = content.count('#')
        if 3 <= hashtag_count <= 5:
            score += 0.1
        
        # Adjust based on questions (engagement driver)
        if '?' in content:
            score += 0.1
        
        return min(score, 1.0)
```

### 3. Engagement Prediction Model

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

class EngagementPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100)
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.is_trained = False
    
    def extract_features(self, posts_df):
        """Extract features from posts for engagement prediction"""
        features = pd.DataFrame()
        
        # Text features
        text_features = self.vectorizer.fit_transform(posts_df['content'])
        text_df = pd.DataFrame(text_features.toarray())
        
        # Metadata features
        features['content_length'] = posts_df['content'].str.len()
        features['hashtag_count'] = posts_df['content'].str.count('#')
        features['mention_count'] = posts_df['content'].str.count('@')
        features['question_count'] = posts_df['content'].str.count('?')
        features['emoji_count'] = posts_df['content'].str.count('😀|😃|😄|😁|😆|😅|😂|🤣|😊|😇|🙂|🙃|😉|😌|😍|🥰|😘|😗|😙|😚|😋|😛|😝|😜|🤪|🤨|🧐|🤓|😎|🤩|🥳|😏|😒|😞|😔|😟|😕|🙁|☹️|😣|😖|😫|😩|🥺|😢|😭|😤|😠|😡|🤬|🤯|😳|🥵|🥶|😱|😨|😰|😥|😓|🤗|🤔|🤭|🤫|🤥|😶|😐|😑|😬|🙄|😯|😦|😧|😮|😲|🥱|😴|🤤|😪|😵|🤐|🥴|🤢|🤮|🤧|😷|🤒|🤕')
        features['hour_posted'] = pd.to_datetime(posts_df['posted_at']).dt.hour
        features['day_of_week'] = pd.to_datetime(posts_df['posted_at']).dt.dayofweek
        
        # Combine with text features
        return pd.concat([features, text_df], axis=1)
    
    def train(self, posts_df):
        """Train the engagement prediction model"""
        features = self.extract_features(posts_df)
        
        # Calculate engagement rate as target
        posts_df['engagement_rate'] = (
            posts_df['likes'] + posts_df['comments'] + posts_df['shares']
        ) / posts_df['followers']  # Assuming followers column exists
        
        self.model.fit(features, posts_df['engagement_rate'])
        self.is_trained = True
        
        # Save model
        joblib.dump(self.model, 'engagement_model.pkl')
        joblib.dump(self.vectorizer, 'text_vectorizer.pkl')
    
    def predict(self, content, metadata):
        """Predict engagement for new content"""
        if not self.is_trained:
            return 0.5  # Default prediction
        
        # Create feature vector
        features = self.extract_single_post_features(content, metadata)
        prediction = self.model.predict([features])[0]
        
        return max(0, min(1, prediction))  # Clamp between 0 and 1
```

## Deployment Architecture

### Docker Configuration

```dockerfile
# Dockerfile for Backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile for ML Service
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: contentai
      POSTGRES_USER: contentai
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://contentai:your_password@postgres:5432/contentai
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your_jwt_secret
      OPENAI_API_KEY: your_openai_key
    depends_on:
      - postgres
      - redis

  ml-service:
    build: ./ml-service
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://contentai:your_password@postgres:5432/contentai
      OPENAI_API_KEY: your_openai_key
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Implementation Steps

### Phase 1: Core Backend (Week 1-2)
1. Set up database schema
2. Implement authentication system
3. Create basic CRUD operations for users and content
4. Set up API endpoints

### Phase 2: ML Integration (Week 3-4)
1. Implement tone analysis service
2. Create content generation pipeline
3. Build engagement prediction model
4. Integrate ML services with backend API

### Phase 3: Advanced Features (Week 5-6)
1. Implement scheduling system with cron jobs
2. Add real-time notifications
3. Create analytics dashboard backend
4. Implement content templates system

### Phase 4: Production Ready (Week 7-8)
1. Add comprehensive error handling
2. Implement rate limiting and security measures
3. Set up monitoring and logging
4. Deploy to cloud infrastructure
5. Add automated testing

## Security Considerations

1. **API Security**: Rate limiting, input validation, SQL injection prevention
2. **Authentication**: JWT with refresh tokens, password hashing with bcrypt
3. **Data Privacy**: Encrypt sensitive user data, GDPR compliance
4. **ML Model Security**: Input sanitization, model versioning, fallback mechanisms

## Monitoring and Analytics

1. **Application Monitoring**: Use tools like New Relic or DataDog
2. **Database Monitoring**: PostgreSQL performance metrics
3. **ML Model Monitoring**: Track prediction accuracy and model drift
4. **User Analytics**: Content generation success rates, user engagement

This architecture provides a scalable, maintainable foundation for your AI-powered content creation platform with proper separation of concerns and robust ML integration.