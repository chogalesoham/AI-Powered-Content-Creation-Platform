# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
#
# # Import the core logic from your other file
# from style_analyzer import analyze_posts, generate_new_post
#
# # Load environment variables from a .env file
# load_dotenv()
#
# # Initialize the Flask application
# app = Flask(__name__)
#
# # Enable Cross-Origin Resource Sharing (CORS)
# # This allows a web frontend to send requests to this Flask backend
# CORS(app)
#
#
# @app.route('/generate', methods=['POST'])
# def generate():
#     """
#     API endpoint to analyze posts and generate a new one.
#     Expects a JSON payload with 'posts' (a list of 3 strings)
#     and 'topic' (a string).
#     """
#     # 1. Get data from the incoming request
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "Invalid JSON payload"}), 400
#
#     posts = data.get('posts')
#     topic = data.get('topic')
#
#     # 2. Validate the input
#     if not posts or not isinstance(posts, list) or len(posts) != 3:
#         return jsonify({"error": "Payload must include a 'posts' key with a list of 3 strings."}), 400
#
#     if not topic or not isinstance(topic, str):
#         return jsonify({"error": "Payload must include a 'topic' key with a string."}), 400
#
#     # 3. Perform the analysis
#     style_info = analyze_posts(posts)
#     if not style_info:
#         return jsonify({"error": "Failed to analyze post style. Check your API key and input."}), 500
#
#     # 4. Generate the new post
#     generated_post = generate_new_post(topic, style_info)
#     if not generated_post:
#         return jsonify({"error": "Failed to generate the new post."}), 500
#
#     # 5. Return the successful response
#     return jsonify({
#         "generated_post": generated_post,
#         "identified_style": {
#             "tone": style_info.tone,
#             "niche": style_info.niche,
#             "writing_style": style_info.writing_style
#         }
#     })
#
#
# # This allows you to run the app directly using `python app.py`
# if __name__ == '__main__':
#     # The host '0.0.0.0' makes the server accessible from other devices on your network
#     app.run(host='0.0.0.0', port=5001, debug=True)




#
# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
#
# # Import the core logic functions from your other file
# from style_analyzer import analyze_posts, refine_post_for_platforms
#
# # Load environment variables from a .env file
# load_dotenv()
#
# # Initialize the Flask application
# app = Flask(__name__)
#
# # Enable Cross-Origin Resource Sharing (CORS)
# CORS(app)
#
#
# # --- This is the original endpoint, no changes needed ---
# @app.route('/generate', methods=['POST'])
# def generate():
#     """
#     Original endpoint to analyze posts and generate a single new one.
#     """
#     # ... (code is the same as before)
#     # This endpoint can remain if you still want to use it elsewhere.
#     data = request.get_json()
#     if not data or 'posts' not in data or 'topic' not in data:
#         return jsonify({"error": "Invalid payload"}), 400
#     # For brevity, the old logic is assumed to be here
#     return jsonify({"message": "This is the original endpoint."})
#
#
# # --- NEW Endpoint for the Chatbot ---
# @app.route('/refine_post', methods=['POST'])
# def refine_post_endpoint():
#     """
#     API endpoint for a chatbot to generate refined posts for LinkedIn and Twitter.
#     Expects a JSON payload with 'style_info' (an object) and 'topic' (a string).
#     """
#     # 1. Get data from the incoming request
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "Invalid JSON payload"}), 400
#
#     style_info = data.get('style_info')
#     topic = data.get('topic')
#
#     # 2. Validate the input
#     if not style_info or not isinstance(style_info, dict):
#         return jsonify({"error": "Payload must include a 'style_info' object."}), 400
#
#     if not topic or not isinstance(topic, str):
#         return jsonify({"error": "Payload must include a 'topic' string."}), 400
#
#     # 3. Call the new generation function
#     refined_posts = refine_post_for_platforms(topic, style_info)
#
#     if not refined_posts:
#         return jsonify({"error": "Failed to generate refined posts. Check API key or server logs."}), 500
#
#     # 4. Return the successful response with both posts
#     return jsonify({
#         "linkedin_post": refined_posts.linkedin_post,
#         "twitter_post": refined_posts.twitter_post
#     })
#
#
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)


import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import the refactored logic functions
from style_analyzer import analyze_posts, refine_post_for_platforms

# Load environment variables
load_dotenv()

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)


@app.route('/generate', methods=['POST'])
def generate_style_analysis():
    """
    ENDPOINT 1: ANALYZE POSTS
    Accepts a list of posts and returns the identified writing style.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    posts = data.get('posts')
    if not posts or not isinstance(posts, list) or len(posts) == 0:
        return jsonify({"error": "Payload must include a 'posts' key with a list of strings."}), 400

    # Perform the analysis
    style_info = analyze_posts(posts)
    if not style_info:
        return jsonify({"error": "Failed to analyze post style. Check API key or server logs."}), 500

    # Return only the identified style
    return jsonify({
        "identified_style": {
            "tone": style_info.tone,
            "niche": style_info.niche,
            "writing_style": style_info.writing_style
        }
    })


@app.route('/refine_post', methods=['POST'])
def refine_post_endpoint():
    """
    ENDPOINT 2: REFINE POSTS
    Accepts the identified style and a new topic, then generates
    platform-specific posts.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    # The key is now 'identified_style' to match the output of the first endpoint
    style_info = data.get('identified_style')
    topic = data.get('topic')

    # Validate the input
    if not style_info or not isinstance(style_info, dict):
        return jsonify({"error": "Payload must include an 'identified_style' object."}), 400

    if not topic or not isinstance(topic, str):
        return jsonify({"error": "Payload must include a 'topic' string."}), 400

    # Call the generation function
    refined_posts = refine_post_for_platforms(topic, style_info)

    if not refined_posts:
        return jsonify({"error": "Failed to generate refined posts."}), 500

    # Return the successful response
    return jsonify({
        "linkedin_post": refined_posts.linkedin_post,
        "twitter_post": refined_posts.twitter_post
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
