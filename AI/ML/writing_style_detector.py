# writing_style_detector.py
#
# To use this, you first need to install the textstat library:
# pip install textstat

import textstat

class WritingStyleDetector:
    """
    A class dedicated to analyzing and detecting the writing style of a
    given text based on its readability and complexity.
    """

    def __init__(self, text):
        """
        Initializes the detector with the text to be analyzed.

        Args:
            text (str): The block of text to be analyzed.
        """
        if not isinstance(text, str) or not text.strip():
            raise ValueError("Input text must be a non-empty string.")
        self.text = text

    def _get_grade_level(self):
        """
        Calculates the Flesch-Kincaid grade level of the text.
        This score estimates the U.S. school grade level required to
        understand the text. It's a strong indicator of complexity.

        Returns:
            float: The calculated grade level.
        """
        return textstat.flesch_kincaid_grade(self.text)

    def _interpret_style(self, grade_level):
        """
        Interprets the grade level to determine a writing style category.

        Args:
            grade_level (float): The Flesch-Kincaid grade level.

        Returns:
            str: A descriptive writing style (e.g., "Simple / Casual").
        """
        if grade_level > 12:
            return "Complex / Academic"
        elif grade_level > 8:
            return "Standard / Professional"
        else:
            return "Simple / Casual"

    def analyze(self):
        """
        Performs the full style analysis.

        This is the main public method to be called.

        Returns:
            dict: A dictionary containing the writing style analysis,
                  including the grade level and a clear interpretation.
        """
        grade_level = self._get_grade_level()
        style_interpretation = self._interpret_style(grade_level)

        return {
            "style": style_interpretation,
            "details": {
                "flesch_kincaid_grade": round(grade_level, 2),
                "explanation": "This score estimates the U.S. grade level needed to understand the text."
            }
        }

# --- EXAMPLE USAGE ---
if __name__ == "__main__":
    # Sample 1: A professional, clear announcement
    professional_text = """
    I am thrilled to announce the launch of our new AI-powered analytics platform!
    This cutting-edge solution leverages advanced machine learning algorithms to
    provide deep, actionable insights for enterprise clients. Our journey to this
    milestone has been incredible.
    """

    # Sample 2: A simple, casual social media post
    casual_text = """
    So excited about our new thing! It's an app that helps you with data.
    It was a lot of fun to make. Hope you all like it! :)
    """

    # Sample 3: A complex, academic sentence
    academic_text = """
    The epistemological framework underpinning this research synthesizes
    post-structuralist critiques with phenomenological inquiry to deconstruct
    prevalent ontological assumptions within the discourse.
    """

    print("--- Analyzing Writing Styles ---")

    print("\n1. Analyzing Professional Text...")
    detector1 = WritingStyleDetector(professional_text)
    style1 = detector1.analyze()
    print(style1)

    print("\n2. Analyzing Casual Text...")
    detector2 = WritingStyleDetector(casual_text)
    style2 = detector2.analyze()
    print(style2)

    print("\n3. Analyzing Academic Text...")
    detector3 = WritingStyleDetector(academic_text)
    style3 = detector3.analyze()
    print(style3)