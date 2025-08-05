import nltk
import spacy
import textstat
from collections import Counter
# CORRECTED IMPORT: Import the specific class from the submodule
from nltk.sentiment.vader import SentimentIntensityAnalyzer


class ToneStyleAnalyzer:
    """
    A class to analyze a block of text for its tone (sentiment) and
    style (readability, complexity, keywords).

    This class uses a combination of lightweight, pre-trained models
    and libraries to provide a comprehensive analysis without needing API keys.
    """

    def __init__(self, text):
        """
        Initializes the analyzer with the user's text.

        Args:
            text (str): The block of text to be analyzed.
        """
        if not isinstance(text, str) or not text.strip():
            raise ValueError("Input text must be a non-empty string.")

        self.text = text

        # Load the small English model for spaCy. Perfect for a hackathon.
        # It provides tokenization, part-of-speech tagging, and more.
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Downloading 'en_core_web_sm' spaCy model...")
            from spacy.cli import download
            download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

        # Process the text with spaCy to get a Doc object
        self.doc = self.nlp(self.text)

        # Initialize the VADER sentiment intensity analyzer from NLTK
        try:
            # CORRECTED INSTANTIATION: Use the class directly
            self.sentiment_analyzer = SentimentIntensityAnalyzer()
        except LookupError:
            print("Downloading 'vader_lexicon' for NLTK...")
            nltk.download('vader_lexicon')
            self.sentiment_analyzer = SentimentIntensityAnalyzer()

    def _analyze_sentiment(self):
        """
        Analyzes the sentiment of the text using NLTK's VADER.

        Returns:
            dict: A dictionary containing the sentiment scores (positive,
                  neutral, negative, and a compound score).
        """
        # VADER's polarity_scores returns a dictionary with neg, neu, pos, and compound scores.
        # The 'compound' score is a normalized, weighted composite score that is most useful.
        # It ranges from -1 (most extreme negative) to +1 (most extreme positive).
        return self.sentiment_analyzer.polarity_scores(self.text)

    def _analyze_readability(self):
        """
        Calculates readability scores using the textstat library.

        Returns:
            dict: A dictionary with key readability metrics.
        """
        return {
            # Estimates the U.S. school grade level required to understand the text.
            "flesch_kincaid_grade": textstat.flesch_kincaid_grade(self.text),
            # Gunning Fog Index also estimates the years of formal education needed.
            "gunning_fog": textstat.gunning_fog(self.text),
            # A score from 0-100. Higher scores mean easier to read.
            "flesch_reading_ease": textstat.flesch_reading_ease(self.text)
        }

    def _extract_keywords(self, num_keywords=5):
        """
        Extracts the most relevant keywords using spaCy's part-of-speech tagging.
        It focuses on nouns and proper nouns as they often represent key topics.

        Args:
            num_keywords (int): The number of top keywords to return.

        Returns:
            list: A list of the most common keywords.
        """
        # We consider proper nouns ('PROPN') and regular nouns ('NOUN') as important words.
        # We filter out stop words (common words like 'the', 'a', 'in') and punctuation.
        pos_tags = ['PROPN', 'NOUN']
        keywords = []
        for token in self.doc:
            if not token.is_stop and not token.is_punct and token.pos_ in pos_tags:
                keywords.append(token.lemma_.lower())  # Use lemma for root form of the word

        # Use collections.Counter to find the most common keywords
        keyword_counts = Counter(keywords)
        return [keyword for keyword, _ in keyword_counts.most_common(num_keywords)]

    def generate_style_profile(self):
        """
        Generates a complete style profile by running all analysis methods.

        This is the main public method to be called.

        Returns:
            dict: A comprehensive dictionary representing the text's style profile.
        """
        sentiment_scores = self._analyze_sentiment()
        readability_scores = self._analyze_readability()
        keywords = self._extract_keywords()

        # Compile everything into a single, easy-to-use dictionary
        style_profile = {
            "sentiment": {
                "overall_score": sentiment_scores['compound'],
                "interpretation": "Positive" if sentiment_scores['compound'] >= 0.05 else "Negative" if
                sentiment_scores['compound'] <= -0.05 else "Neutral"
            },
            "complexity": {
                "grade_level": readability_scores['flesch_kincaid_grade'],
                "reading_ease_score": readability_scores['flesch_reading_ease'],
                "interpretation": "Complex / Academic" if readability_scores[
                                                              'flesch_kincaid_grade'] > 12 else "Standard / Professional" if
                readability_scores['flesch_kincaid_grade'] > 8 else "Simple / Casual"
            },
            "substance": {
                "top_keywords": keywords
            },
            "raw_scores": {
                "sentiment_details": sentiment_scores,
                "readability_details": readability_scores
            }
        }
        return style_profile


# --- EXAMPLE USAGE ---
# This block demonstrates how to use the ToneStyleAnalyzer class.
# You can replace this sample_text with the text pasted by your user.
if __name__ == "__main__":
    sample_text = """
    I am deeply disappointed with the new platform. The launch was a complete disaster, the features are buggy, and the entire project feels like a massive step backward for the company. Frankly, this was a failure."""
    print("--- Analyzing Sample Text ---")
    print(f"Text: \"{sample_text[:100]}...\"")
    print("-" * 30)

    try:
        # 1. Create an instance of the analyzer
        analyzer = ToneStyleAnalyzer(sample_text)

        # 2. Generate the complete profile
        profile = analyzer.generate_style_profile()

        # 3. Print the results in a user-friendly way
        import json

        print("Generated Style Profile:")
        print(json.dumps(profile, indent=4))

        print("\n--- How to use this profile ---")
        print("You can now use this profile to engineer a prompt for a generative AI.")
        print(
            "For example: 'Write a LinkedIn post about [new topic] in a Positive, Standard / Professional tone, focusing on keywords like AI and Innovation.'")

    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
