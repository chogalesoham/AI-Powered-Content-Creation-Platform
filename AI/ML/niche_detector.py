import os
import requests
import json


class NicheDetector:
    """
    Uses the Gemini API to detect the content niche, topics, and audience from a block of text.
    """

    def __init__(self, text, api_key):
        if not api_key:
            raise ValueError("Gemini API key is required.")
        self.text = text
        self.api_key = api_key
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={self.api_key}"

    def _extract_json_from_response(self, text):
        """Helper function to safely extract JSON from the AI's response text."""
        try:
            # The API can sometimes wrap the JSON in markdown code fences (```json ... ```)
            json_start_index = text.find('{')
            json_end_index = text.rfind('}') + 1
            if json_start_index != -1 and json_end_index != -1:
                json_str = text[json_start_index:json_end_index]
                return json.loads(json_str)
            return None
        except (json.JSONDecodeError, IndexError):
            return None

    def detect(self):
        """
        Sends the text to the Gemini API with a specialized prompt for niche detection.
        """
        prompt = f"""
        You are an expert market analyst who specializes in identifying personal brands and content niches from written text.
        Analyze the following social media posts provided by a user. Your task is to identify their area of expertise.

        Based on the text, provide a concise summary in a clean JSON format.
        The JSON object MUST include these exact keys: 'primary_niche', 'secondary_topics', and 'inferred_audience'.

        - 'primary_niche': A short, clear label for the main subject area (e.g., "AI in Healthcare", "Sustainable Fashion", "Early-Stage Startup Funding").
        - 'secondary_topics': A Python list of 3-5 related sub-topics the user also discusses.
        - 'inferred_audience': A brief description of the likely target audience for this content (e.g., "Doctors and tech investors", "Eco-conscious consumers", "Founders and VCs").

        Do not include any explanatory text before or after the JSON object.

        Here is the text to analyze:
        ---
        {self.text}
        ---
        """

        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()

            # Safely extract text from the complex response structure
            if 'candidates' in result and result['candidates']:
                first_candidate = result['candidates'][0]
                if 'content' in first_candidate and 'parts' in first_candidate['content'] and \
                        first_candidate['content']['parts']:
                    raw_text = first_candidate['content']['parts'][0]['text']
                    # Parse the JSON from the raw text
                    niche_profile = self._extract_json_from_response(raw_text)
                    if niche_profile:
                        return niche_profile
                    else:
                        return {"error": "Failed to parse JSON from AI response", "raw_response": raw_text}

            return {"error": "No valid candidates found in API response."}

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP ERROR during niche detection: {http_err}")
            return {"error": f"Gemini API error: {http_err.response.text}"}
        except Exception as e:
            print(f"GENERAL ERROR during niche detection: {e}")
            return {"error": str(e)}
