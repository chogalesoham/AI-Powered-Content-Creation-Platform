import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Make sure your analyzer files are in the same directory
from tone_analyzer import ToneStyleAnalyzer
from writing_style_detector import WritingStyleDetector
from niche_detector import NicheDetector

# --- Initialization ---
app = Flask(__name__)
CORS(app)

# --- IMPORTANT: PASTE YOUR GEMINI API KEY HERE ---
GEMINI_API_KEY = "AIzaSyD_5CwCBNL003Ed9TL5iSkHJd8l1fzLR9k"  # If you want to use models other than gemini-2.5-flash-preview-05-20, provide an API key here. Otherwise, leave this as-is.


# --- API Endpoints ---

@app.route('/analyze', methods=['POST'])
def analyze_text_endpoint():
    """
    Analyzes text and returns a SIMPLIFIED profile with only the essential information.
    """
    data = request.get_json()
    if not data or 'text' not in data or not data['text'].strip():
        return jsonify({"error": "No text provided"}), 400

    user_text = data['text']

    try:
        # 1. Analyze Writing Style
        style_detector = WritingStyleDetector(user_text)
        style_profile = style_detector.analyze()
        # Extract only the main style description
        final_style = style_profile.get("style", "Undetermined")

        # 2. Analyze Tone
        tone_analyzer = ToneStyleAnalyzer(user_text)
        tone_profile = tone_analyzer.generate_style_profile()
        # Extract only the main sentiment interpretation
        final_tone = tone_profile.get("sentiment", {}).get("interpretation", "Undetermined")

        # 3. Detect Niche
        niche_detector = NicheDetector(user_text, GEMINI_API_KEY)
        niche_profile = niche_detector.detect()
        # Extract only the primary niche, with error handling
        if "error" in niche_profile:
            final_niche = f"Error: {niche_profile['error']}"
        else:
            final_niche = niche_profile.get("primary_niche", "Undetermined")

        # 4. Combine into the simplified profile
        simplified_profile = {
            "writing_style": final_style,
            "tone": final_tone,
            "niche": final_niche
        }
        return jsonify(simplified_profile)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate', methods=['POST'])
def generate_text_endpoint():
    """
    Generates a new social media post using the simplified analysis profile.
    """
    print("\n--- Received Generation Request ---")
    data = request.get_json()
    # The 'style_profile' is now our new simplified profile
    analysis_profile = data.get('analysis_profile')
    new_topic = data.get('new_topic')

    if not analysis_profile or not new_topic:
        return jsonify({"error": "Missing analysis profile or new topic"}), 400

    try:
        # Extract the clean data from the simplified profile
        style = analysis_profile.get('writing_style', 'clear and concise')
        tone = analysis_profile.get('tone', 'neutral')
        niche = analysis_profile.get('niche', 'general topics')

        # Handle case where niche detection failed
        if "Error:" in niche:
            print(f"Warning: Niche detection failed ('{niche}'). Falling back to general expertise.")
            niche = "a specific industry"  # Fallback for the prompt

        # Engineer the new, more direct meta-prompt
        meta_prompt = (
            f"You are an expert social media manager specializing in '{niche}'. "
            f"Your task is to write a short, engaging social media post. "
            f"Follow these instructions exactly:\n"
            f"1.  **Topic:** Write about '{new_topic}'.\n"
            f"2.  **Tone:** The post must have a '{tone}' tone.\n"
            f"3.  **Writing Style:** The style must be '{style}'.\n\n"
            f"Write only the social media post content. Do not add any introductory text or your own comments."
        )

        print(f"Constructed Meta-Prompt:\n{meta_prompt}")

        # --- Gemini API Call ---
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
        payload = {"contents": [{"parts": [{"text": meta_prompt}]}]}
        headers = {'Content-Type': 'application/json'}

        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        if 'candidates' in result and result['candidates']:
            first_candidate = result['candidates'][0]
            if 'content' in first_candidate and 'parts' in first_candidate['content'] and first_candidate['content'][
                'parts']:
                generated_text = first_candidate['content']['parts'][0]['text']
            else:
                generated_text = "Error: No content found in API response."
        else:
            generated_text = "Error: No candidates found in API response."

        return jsonify({"generated_post": generated_text.strip()})

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP ERROR during generation: {http_err}")
        return jsonify({"error": f"Gemini API error: {http_err.response.text}"}), 500
    except Exception as e:
        print(f"GENERAL ERROR during generation: {e}")
        return jsonify({"error": str(e)}), 500


# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
