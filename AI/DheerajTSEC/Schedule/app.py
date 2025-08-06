import os
import json
import time
import threading
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# --- Configuration & Initialization ---
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for website integration

# IMPORTANT: Set your GroqCloud API key in a .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DRAFT_FILE = 'final.json'

# Initialize the Groq client
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq client initialized successfully.")
except Exception as e:
    groq_client = None
    print(f"⚠️ Warning: Could not initialize Groq client. The API will not work. Error: {e}")


# --- Core Logic Functions ---

def generate_post_from_style(client, style_info: dict, prompt_idea: str = None):
    """
    Generates a social media post using the Groq API based on a style profile
    and an optional, specific prompt idea.
    """
    print(f"🧠 Generating post for style: {style_info} and idea: '{prompt_idea}'")

    # Base prompt telling the AI its role and to follow the style guide
    system_prompt = (
        "Act as an expert social media content creator. Generate one concise and engaging social media post. "
        "You must adhere to the following style guide:\n"
        f"**Niche/Topic:** {style_info.get('niche', 'General')}\n"
        f"**Tone:** {style_info.get('tone', 'Neutral')}\n"
        f"**Writing Style:** {style_info.get('writing_style', 'Standard')}\n\n"
    )

    # Add the specific user idea to the prompt if it exists
    if prompt_idea:
        user_prompt = f"Now, create the post based on this specific idea: '{prompt_idea}'"
    else:
        user_prompt = "Now, create a post based on the niche defined in the style guide."

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.75,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ An error occurred with the Groq API: {e}")
        return None


def save_for_review(style_info: dict, generated_draft: str, prompt_idea: str = None):
    """
    Saves the generated draft and its original context to a JSON file.
    """
    new_draft = {
        'generation_timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'original_style': style_info,
        'original_prompt_idea': prompt_idea if prompt_idea else 'None (Generated from style only)',
        'generated_draft': generated_draft
    }
    try:
        data = []
        if os.path.exists(DRAFT_FILE) and os.path.getsize(DRAFT_FILE) > 0:
            with open(DRAFT_FILE, 'r') as f:
                data = json.load(f)

        data.append(new_draft)

        with open(DRAFT_FILE, 'w') as f:
            json.dump(data, f, indent=4)

        print(f"✅ Draft saved to '{DRAFT_FILE}'.")
    except (IOError, json.JSONDecodeError) as e:
        print(f"❌ Could not read or write to the JSON file: {e}")


def scheduled_task(scheduled_time: datetime, style_info: dict, prompt_idea: str = None):
    """
    This function runs in a background thread, waits for the scheduled time,
    and then triggers the post generation and saving.
    """
    while datetime.now() < scheduled_time:
        time.sleep(15)

    print(f"\n🔔 Time reached! Running scheduled task...")
    if not groq_client:
        print("❌ Cannot generate post because Groq client is not initialized.")
        return

    generated_post = generate_post_from_style(groq_client, style_info, prompt_idea)
    if generated_post:
        save_for_review(style_info, generated_post, prompt_idea)
    print("✅ Background task complete.")


# --- Flask API Endpoint ---

@app.route('/schedule_post', methods=['POST'])
def schedule_post_endpoint():
    """
    API endpoint to schedule a post generation task.
    Accepts an 'identified_style', a 'scheduled_time', and an optional 'prompt_idea'.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload."}), 400

    style_info = data.get('identified_style')
    scheduled_time_str = data.get('scheduled_time')
    prompt_idea = data.get('prompt_idea')  # This is the new optional field

    if not style_info or not all(k in style_info for k in ['niche', 'tone', 'writing_style']):
        return jsonify(
            {"error": "Payload must include 'identified_style' with 'niche', 'tone', and 'writing_style' keys."}), 400
    if not scheduled_time_str:
        return jsonify({"error": "Payload must include a 'scheduled_time' key (e.g., '2025-08-06 09:30:00')."}), 400

    try:
        scheduled_time = datetime.strptime(scheduled_time_str, '%Y-%m-%d %H:%M:%S')
        if scheduled_time < datetime.now():
            return jsonify({"error": "Scheduled time cannot be in the past."}), 400
    except ValueError:
        return jsonify({"error": "Invalid datetime format. Please use 'YYYY-MM-DD HH:MM:S'."}), 400

    thread = threading.Thread(target=scheduled_task, args=(scheduled_time, style_info, prompt_idea))
    thread.daemon = True
    thread.start()

    return jsonify({
        "message": "Post generation scheduled successfully",
        "scheduled_for": scheduled_time_str,
        "style": style_info,
        "prompt_idea": prompt_idea if prompt_idea else "None"
    }), 202


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)