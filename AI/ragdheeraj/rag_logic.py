# import os
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import Chroma
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_groq import ChatGroq
# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
#
# # --- Configuration ---
# DOCUMENT_PATH = "document.txt"
# EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
# CHAT_MODEL_NAME = "llama3-70b-8192"
#
#
# def create_rag_chain():
#     """
#     Creates and configures the RAG chain.
#     This function is designed to be called once when the application starts.
#     """
#     # 1. Check for Groq API Key
#     groq_api_key = os.getenv("GROQ_API_KEY")
#     if not groq_api_key:
#         raise ValueError("GROQ_API_KEY environment variable not set.")
#
#     # 2. Load the document
#     if not os.path.exists(DOCUMENT_PATH):
#         # Create a dummy document if it doesn't exist
#         with open(DOCUMENT_PATH, 'w', encoding='utf-8') as f:
#             f.write(
#                 "The recent wave of tech layoffs has been a brutal reminder that corporate loyalty is a myth. "
#                 "Companies that once boasted of 'family-like' cultures are now shedding thousands of jobs. "
#                 "This trend reveals a deep-seated instability in the tech industry, where short-term profits "
#                 "come at the expense of employee well-being."
#             )
#         print(f"Created a dummy document at '{DOCUMENT_PATH}'.")
#
#     with open(DOCUMENT_PATH, 'r', encoding='utf-8') as f:
#         document_text = f.read()
#     print("Document loaded successfully.")
#
#     # 3. Split the document into chunks
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#     docs = text_splitter.create_documents([document_text])
#     print(f"Document split into {len(docs)} chunks.")
#
#     # 4. Create vector store with HuggingFace embeddings
#     print("Creating vector store with HuggingFace embeddings...")
#     embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
#     vector_store = Chroma.from_documents(documents=docs, embedding=embeddings)
#     retriever = vector_store.as_retriever()
#     print("Vector store created.")
#
#     # 5. Initialize Chat LLM with Groq
#     llm = ChatGroq(model=CHAT_MODEL_NAME, temperature=0.7, groq_api_key=groq_api_key)
#
#     # 6. Define the prompt template
#     prompt = ChatPromptTemplate.from_template("""
#     You are an expert content writer for LinkedIn, specializing in professional posts with a critical and negative tone.
#     Your task is to analyze the provided document content and a user's instruction to generate a concise,
#     engaging, and professionally critical LinkedIn post.
#
#     Use only the provided context to inform your response. Do not use outside knowledge.
#
#     Context:
#     {context}
#
#     Instruction:
#     {input}
#
#     Please write the LinkedIn post, including relevant hashtags where appropriate.
#     The post should not exceed 100 words and must have a negative tone on a tech topic.
#     """)
#
#     # 7. Create the RAG chain
#     document_chain = create_stuff_documents_chain(llm, prompt)
#     retrieval_chain = create_retrieval_chain(retriever, document_chain)
#
#     print("RAG chain created successfully.")
#     return retrieval_chain
#


import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# --- Configuration ---
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
CHAT_MODEL_NAME = "llama3-70b-8192"


def create_and_invoke_rag_chain(document_content: str, instruction: str):
    """
    Takes document content and an instruction, builds the RAG chain on the fly,
    invokes it, and returns the generated post.
    """
    # 1. Check for Groq API Key
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY environment variable not set on the server.")

    print("Processing uploaded document...")

    # 2. Split the document content into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.create_documents([document_content])
    print(f"Document split into {len(docs)} chunks.")

    # 3. Create vector store from the chunks
    # Note: This happens for every request, which can be slow for very large documents.
    print("Creating vector store for the request...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    vector_store = Chroma.from_documents(documents=docs, embedding=embeddings)
    retriever = vector_store.as_retriever()
    print("Vector store created.")

    # 4. Initialize Chat LLM & Prompt
    llm = ChatGroq(model=CHAT_MODEL_NAME, temperature=0.7, groq_api_key=groq_api_key)
    prompt = ChatPromptTemplate.from_template("""
    You are an expert content writer for LinkedIn, specializing in professional posts with a critical and negative tone.
    Use only the provided context to inform your response.

    Context:
    {context}

    Instruction:
    {input}

    Write a concise LinkedIn post (under 100 words) based on the instruction, using a negative tone and including relevant hashtags.
    """)

    # 5. Create and invoke the RAG chain
    document_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    print("Invoking RAG chain...")
    response = retrieval_chain.invoke({"input": instruction})

    return response.get("answer", "No response generated.")


