import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import functions from your other logic files
from style_analyzer import analyze_posts, refine_post_for_platforms
from engagement_predictor import predict_engagement

# Load environment variables
load_dotenv()

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)


# --- Endpoint 1: Style Analysis ---
@app.route('/generate', methods=['POST'])
def generate_style_analysis():
    """
    Accepts a list of posts and returns the identified writing style.
    """
    data = request.get_json()
    if not data or 'posts' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    style_info = analyze_posts(data.get('posts'))
    if not style_info:
        return jsonify({"error": "Failed to analyze post style."}), 500

    return jsonify({
        "identified_style": style_info.dict()
    })


# --- Endpoint 2: Refined Post Generation ---
@app.route('/refine_post', methods=['POST'])
def refine_post_endpoint():
    """
    Accepts style and topic, then generates platform-specific posts.
    """
    data = request.get_json()
    if not data or 'identified_style' not in data or 'topic' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    refined_posts = refine_post_for_platforms(data.get('topic'), data.get('identified_style'))
    if not refined_posts:
        return jsonify({"error": "Failed to generate refined posts."}), 500

    return jsonify(refined_posts.dict())


# --- NEW Endpoint 3: Engagement Prediction ---
@app.route('/predict_engagement', methods=['POST'])
def predict_engagement_endpoint():
    """
    API endpoint to predict engagement for a given social media post.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    # Validate required fields
    required_fields = ['text', 'platform', 'timestamp']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields. Please provide {required_fields}"}), 400

    # Get predictions
    predictions, error = predict_engagement(data)

    if error:
        return jsonify({"error": f"Prediction failed: {error}"}), 500

    return jsonify(predictions)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
