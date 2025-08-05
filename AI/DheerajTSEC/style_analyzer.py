# import os
# from langchain_groq import ChatGroq
# from pydantic import BaseModel
# from typing import List
#
#
# # Define the Pydantic model for our structured output
# # This acts as a schema that the model will be guided to follow
# class StyleAnalysis(BaseModel):
#     """
#     Analysis of a user's social media writing style.
#     """
#     tone: str
#     niche: str
#     writing_style: str
#
#
# def analyze_posts(posts: List[str]) -> StyleAnalysis | None:
#     """
#     Analyzes the provided posts to determine tone, niche, and writing style
#     using a structured output method.
#     """
#     print("\nAnalyzing posts to find style...")
#
#     # Initialize the LLM with the specified model
#     # The API key is loaded from the environment variable GROQ_API_KEY
#     try:
#         llm = ChatGroq(model="llama3-70b-8192",
#                        temperature=0,  # Use a low temperature for consistent analysis
#                        groq_api_key=os.getenv("GROQ_API_KEY"))
#
#         # Use with_structured_output to ensure the response conforms to our Pydantic model
#         structured_llm = llm.with_structured_output(StyleAnalysis)
#
#         posts_text = "\n\n".join(posts)
#
#         analysis_prompt = f"""
#         You are an expert social media analyst. Based on the following three posts, please identify the following attributes in one word each: tone, niche, and writing style.
#
#         Posts:
#         {posts_text}
#
#         Provide the response as a JSON object with the keys "tone", "niche", and "writing_style".
#         """
#
#         # Invoke the structured LLM to get a Pydantic object
#         analysis_data = structured_llm.invoke(analysis_prompt)
#         print("\nAnalysis complete!")
#         return analysis_data
#     except Exception as e:
#         print(f"Error during post analysis: {e}")
#         return None
#
#
# def generate_new_post(topic: str, style_info: StyleAnalysis) -> str | None:
#     """
#     Generates a new post based on the identified style and a new topic.
#     """
#     if not style_info:
#         print("Cannot generate a new post without style information.")
#         return None
#
#     print(f"\nGenerating a new post on the topic '{topic}'...")
#
#     # Initialize the LLM for text generation
#     try:
#         llm = ChatGroq(model="llama3-70b-8192",
#                        temperature=0.7,  # Higher temperature for creativity in the post
#                        groq_api_key=os.getenv("GROQ_API_KEY"))
#
#         # The prompt for generation incorporates the analysis results
#         generation_prompt = f"""
#         Generate a concise social media post for LinkedIn or Twitter on the following topic: "{topic}".
#
#         The post must adhere to the following style attributes:
#         - Tone: {style_info.tone}
#         - Niche: {style_info.niche}
#         - Writing Style: {style_info.writing_style}
#
#         Keep the post under 150 words and include relevant hashtags. Do not include any introductory text like "Here is the post:".
#         """
#
#         # Invoke the LLM to get the text response
#         response = llm.invoke(generation_prompt)
#         print("\nPost generation complete!")
#         return response.content
#     except Exception as e:
#         print(f"Error during post generation: {e}")
#         return None




#
#
# import os
# from langchain_groq import ChatGroq
# from pydantic import BaseModel, Field
# from typing import List, Dict
#
#
# # --- Existing Pydantic Model ---
# class StyleAnalysis(BaseModel):
#     """
#     Analysis of a user's social media writing style.
#     """
#     tone: str
#     niche: str
#     writing_style: str
#
#
# # --- NEW Pydantic Model for the Refined Posts ---
# class RefinedPosts(BaseModel):
#     """
#     Container for social media posts tailored to specific platforms.
#     """
#     linkedin_post: str = Field(description="A post generated specifically for LinkedIn, professional in tone.")
#     twitter_post: str = Field(description="A post generated specifically for Twitter, concise and engaging.")
#
#
# # --- Existing analysis function (no changes) ---
# def analyze_posts(posts: List[str]) -> StyleAnalysis | None:
#     """
#     Analyzes the provided posts to determine tone, niche, and writing style.
#     """
#     print("\nAnalyzing posts to find style...")
#     try:
#         llm = ChatGroq(model="llama3-70b-8192",
#                        temperature=0,
#                        groq_api_key=os.getenv("GROQ_API_KEY"))
#         structured_llm = llm.with_structured_output(StyleAnalysis)
#         posts_text = "\n\n".join(posts)
#         analysis_prompt = f"""
#         You are an expert social media analyst. Based on the following three posts, please identify the following attributes in one word each: tone, niche, and writing style.
#         Posts:
#         {posts_text}
#         Provide the response as a JSON object with the keys "tone", "niche", and "writing_style".
#         """
#         analysis_data = structured_llm.invoke(analysis_prompt)
#         print("\nAnalysis complete!")
#         return analysis_data
#     except Exception as e:
#         print(f"Error during post analysis: {e}")
#         return None
#
#
# # --- Existing generation function (no changes) ---
# def generate_new_post(topic: str, style_info: StyleAnalysis) -> str | None:
#     # This function is no longer called by the new endpoint but is kept for the original one.
#     # ... (code is the same as before)
#     pass
#
#
# # --- NEW Function to Generate Refined Posts for Chatbot ---
# def refine_post_for_platforms(topic: str, style_info: Dict) -> RefinedPosts | None:
#     """
#     Generates tailored posts for LinkedIn and Twitter using a meta prompt.
#     """
#     if not style_info:
#         print("Cannot generate posts without style information.")
#         return None
#
#     print(f"\nGenerating refined posts on the topic '{topic}'...")
#
#     try:
#         # Initialize the LLM with structured output for the new Pydantic model
#         llm = ChatGroq(model="llama3-70b-8192",
#                        temperature=0.7,  # Creative temperature
#                        groq_api_key=os.getenv("GROQ_API_KEY"))
#         structured_llm = llm.with_structured_output(RefinedPosts)
#
#         # This is the "Meta Prompt"
#         # It gives the LLM a role, context, a specific task, and constraints.
#         meta_prompt = f"""
#         You are an expert social media manager and copywriter. Your task is to generate two distinct social media posts based on a user's writing style and a given topic.
#
#         **User's Writing Style Profile:**
#         - **Tone:** {style_info.get('tone', 'neutral')}
#         - **Niche:** {style_info.get('niche', 'general')}
#         - **Writing Style:** {style_info.get('writing_style', 'clear')}
#
#         **Topic:**
#         "{topic}"
#
#         **Instructions:**
#         Generate two versions of the post, one for LinkedIn and one for Twitter.
#
#         1.  **LinkedIn Post:**
#             - Adopt a professional and insightful tone, suitable for the platform.
#             - Structure the post with clear paragraphs or bullet points for readability.
#             - Aim for a length of 100-150 words.
#             - Include 3-5 relevant, professional hashtags.
#
#         2.  **Twitter Post:**
#             - Adopt a concise, punchy, and engaging tone.
#             - Keep the post under 280 characters.
#             - Use 2-3 relevant, high-visibility hashtags.
#             - You can use an appropriate emoji if it fits the tone.
#
#         Provide the output as a single JSON object with two keys: "linkedin_post" and "twitter_post".
#         """
#
#         # Invoke the structured LLM to get the RefinedPosts Pydantic object
#         refined_posts_data = structured_llm.invoke(meta_prompt)
#         print("\nRefined posts generation complete!")
#         return refined_posts_data
#
#     except Exception as e:
#         print(f"Error during refined post generation: {e}")
#         return None


import os
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from typing import List, Dict


# --- Pydantic Model for Style Analysis ---
class StyleAnalysis(BaseModel):
    """
    Analysis of a user's social media writing style.
    """
    tone: str
    niche: str
    writing_style: str


# --- Pydantic Model for the Refined Posts ---
class RefinedPosts(BaseModel):
    """
    Container for social media posts tailored to specific platforms.
    """
    linkedin_post: str = Field(description="A post generated specifically for LinkedIn, professional in tone.")
    twitter_post: str = Field(description="A post generated specifically for Twitter, concise and engaging.")


def analyze_posts(posts: List[str]) -> StyleAnalysis | None:
    """
    Analyzes the provided posts to determine tone, niche, and writing style.
    This function serves the /generate endpoint.
    """
    print("\nAnalyzing posts to find style...")
    try:
        llm = ChatGroq(model="llama3-70b-8192",
                       temperature=0,
                       groq_api_key=os.getenv("GROQ_API_KEY"))
        structured_llm = llm.with_structured_output(StyleAnalysis)

        # Ensure posts are joined correctly
        posts_text = "\n\n---\n\n".join(posts)

        analysis_prompt = f"""
        You are an expert social media analyst. Based on the following three posts, please identify the following attributes in one word each: tone, niche, and writing style.

        Posts:
        {posts_text}

        Provide the response as a JSON object with the keys "tone", "niche", and "writing_style".
        """
        analysis_data = structured_llm.invoke(analysis_prompt)
        print("\nAnalysis complete!")
        return analysis_data
    except Exception as e:
        print(f"Error during post analysis: {e}")
        return None


def refine_post_for_platforms(topic: str, style_info: Dict) -> RefinedPosts | None:
    """
    Generates tailored posts for LinkedIn and Twitter using a meta prompt.
    This function serves the /refine_post endpoint.
    """
    if not style_info:
        print("Cannot generate posts without style information.")
        return None

    print(f"\nGenerating refined posts on the topic '{topic}'...")

    try:
        llm = ChatGroq(model="llama3-70b-8192",
                       temperature=0.7,
                       groq_api_key=os.getenv("GROQ_API_KEY"))
        structured_llm = llm.with_structured_output(RefinedPosts)

        meta_prompt = f"""
        You are an expert social media manager. Your task is to generate two distinct social media posts based on a user's writing style profile and a given topic.

        **User's Writing Style Profile:**
        - **Tone:** {style_info.get('tone', 'neutral')}
        - **Niche:** {style_info.get('niche', 'general')}
        - **Writing Style:** {style_info.get('writing_style', 'clear')}

        **Topic:**
        "{topic}"

        **Instructions:**
        Generate two versions of the post, one for LinkedIn and one for Twitter, adhering to the style profile.

        1.  **LinkedIn Post:** Professional, insightful, 100-150 words, 3-5 relevant hashtags.
        2.  **Twitter Post:** Concise, engaging, under 280 characters, 2-3 relevant hashtags.

        Provide the output as a single JSON object with two keys: "linkedin_post" and "twitter_post".
        """

        refined_posts_data = structured_llm.invoke(meta_prompt)
        print("\nRefined posts generation complete!")
        return refined_posts_data

    except Exception as e:
        print(f"Error during refined post generation: {e}")
        return None
