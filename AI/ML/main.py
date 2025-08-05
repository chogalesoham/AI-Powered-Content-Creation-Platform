# /ai-ml/main.py

# --- Core Imports ---
import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

# --- AI/ML Imports ---
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ==============================================================================
# 1. INITIAL CONFIGURATION AND MODEL LOADING
# ==============================================================================

# --- FastAPI App Initialization ---
app = FastAPI(
    title="AI Content Creation Platform API",
    description="API for content analysis, generation, and template matching."
)

# --- Google Gemini API Configuration ---
# IMPORTANT: Replace with your actual key. Best practice is to use environment variables.
# e.g., GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_API_KEY = "AIzaSyD_5CwCBNL003Ed9TL5iSkHJd8l1fzLR9k" 
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set. Please add your key.")
genai.configure(api_key=GOOGLE_API_KEY)


# --- Load Local Models at Startup ---
# This is efficient because models are loaded only once when the server starts.
print("Loading Sentence-BERT model for template matching...")
try:
    sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
    template_embeddings = np.load("./models/template_embeddings.npy")
    template_ids = np.load("./models/template_ids.npy")
    print("Sentence-BERT models and embeddings loaded successfully.")
except FileNotFoundError:
    print("Warning: Template embedding files not found. The /suggest-templates endpoint will fail.")
    print("Please run the /ai-ml/scripts/preprocess_templates.py script first.")
    sbert_model = None
    template_embeddings = None
    template_ids = None

# ==============================================================================
# 2. PYDANTIC MODELS FOR REQUEST/RESPONSE DATA STRUCTURE
# ==============================================================================

class StyleProfile(BaseModel):
    tone: str
    vocabulary: list[str]
    structure: str
    emoji_usage: str

class AnalysisRequest(BaseModel):
    posts: list[str]

class GenerationRequest(BaseModel):
    user_prompt: str
    platform: str
    style_profile: StyleProfile

class GeneratedContent(BaseModel):
    draft: str

class TemplateRequest(BaseModel):
    user_prompt: str
    top_k: int = 3

class TemplateSuggestion(BaseModel):
    template_id: str
    similarity_score: float


# ==============================================================================
# 3. API ENDPOINTS
# ==============================================================================

@app.get("/", summary="Health Check")
def read_root():
    """A simple health check endpoint to confirm the service is running."""
    return {"status": "AI/ML Service is running"}

# --- Endpoint for Content Analysis ---
@app.post("/analyze-style", response_model=StyleProfile, summary="Analyze Brand Voice")
async def analyze_style(request: AnalysisRequest):
    """
    Analyzes a list of posts to determine the user's writing style using Gemini Pro.
    """
    content_block = "\n---\n".join(request.posts)
    
    prompt = f"""
    As a Brand Voice Analyst, analyze the following social media posts.
    Based on the text, determine the user's tone, key vocabulary, sentence structure, and emoji usage.
    Respond *only* with a valid JSON object matching this structure:
    {{
        "tone": "A short description (e.g., 'Professional and Authoritative', 'Witty and Casual')",
        "vocabulary": ["A list of 5-10 characteristic keywords or phrases"],
        "structure": "A description of sentence structure (e.g., 'Short, punchy sentences')",
        "emoji_usage": "A description of emoji usage ('Frequent', 'Minimal', 'None')"
    }}

    Here are the posts to analyze:

    {content_block}
    """
    
    model = genai.GenerativeModel('gemini-1.0-pro')
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
    )
    
    style_data = json.loads(response.text)
    return StyleProfile(**style_data)

# --- Endpoint for Content Generation ---
@app.post("/generate-content", response_model=GeneratedContent, summary="Generate Personalized Content")
async def generate_content(request: GenerationRequest):
    """
    Generates platform-specific content personalized to the user's style using Gemini Pro.
    """
    platform_rules = {
        "LinkedIn": "Keep posts professional, well-structured, and avoid overly casual language. Use relevant professional hashtags.",
        "Twitter": "Keep posts concise (under 280 characters), engaging, and use popular or relevant hashtags. A conversational tone is best.",
        "Instagram": "Write an engaging caption that encourages interaction. Focus on storytelling and use relevant, popular hashtags. Place hashtags at the end."
    }
    
    prompt = f"""
    You are an expert social media content creator specializing in {request.platform}.
    Your task is to write a post for the user based on their request.
    You MUST adhere to the user's established brand voice and the platform's best practices.

    **Brand Voice Guidelines:**
    - Tone: {request.style_profile.tone}
    - Key Vocabulary: Use words like {', '.join(request.style_profile.vocabulary) if request.style_profile.vocabulary else 'the user provided none'}.
    - Sentence Structure: Emulate a style of '{request.style_profile.structure}'.
    - Emoji Usage: {request.style_profile.emoji_usage}.

    **Platform Rules for {request.platform}:**
    {platform_rules.get(request.platform, "Follow standard social media best practices.")}

    **User's Request:**
    '{request.user_prompt}'

    Now, generate the content based on all the rules and the user's request. Output only the final post content and nothing else.
    """
    
    model = genai.GenerativeModel('gemini-1.0-pro')
    response = model.generate_content(prompt)
    
    return GeneratedContent(draft=response.text.strip())

# --- Endpoint for Template Matching ---
@app.post("/suggest-templates", response_model=list[TemplateSuggestion], summary="Suggest Content Templates")
async def suggest_templates(request: TemplateRequest):
    """
    Finds the most relevant templates for a user prompt using semantic search (Sentence-BERT).
    """
    if sbert_model is None or request.user_prompt.strip() == "":
        return []

    prompt_embedding = sbert_model.encode([request.user_prompt])
    similarities = cosine_similarity(prompt_embedding, template_embeddings)[0]
    top_k_indices = np.argsort(similarities)[-request.top_k:][::-1]
    
    results = [
        TemplateSuggestion(
            template_id=str(template_ids[i]),
            similarity_score=float(similarities[i])
        ) for i in top_k_indices
    ]
    
    return results