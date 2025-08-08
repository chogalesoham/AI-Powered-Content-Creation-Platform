import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import the refactored RAG logic
from rag_logic import create_and_invoke_rag_chain

# Load environment variables
load_dotenv()

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)


@app.route('/generate_rag_post', methods=['POST'])
def generate_rag_post_endpoint():
    """
    API endpoint to generate a LinkedIn post from an uploaded document.
    Accepts multipart/form-data with a 'document' file and an 'instruction' text field.
    """
    # 1. Check for the file part in the request
    if 'document' not in request.files:
        return jsonify({"error": "No 'document' file part in the request"}), 400

    file = request.files['document']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # 2. Check for the instruction part in the form data
    instruction = request.form.get('instruction')
    if not instruction:
        return jsonify({"error": "No 'instruction' provided in the form data"}), 400

    try:
        # 3. Read the file content and decode it
        document_content = file.read().decode('utf-8')

        # 4. Call the RAG logic function with the content and instruction
        generated_post = create_and_invoke_rag_chain(document_content, instruction)

        return jsonify({"generated_post": generated_post})

    except Exception as e:
        # This will catch errors from file reading or the RAG chain logic
        print(f"An error occurred: {e}")
        return jsonify({"error": f"Failed to process request: {e}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
