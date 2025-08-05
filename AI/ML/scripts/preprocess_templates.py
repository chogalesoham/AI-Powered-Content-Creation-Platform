# /AI/ML/scripts/preprocess_templates.py
import numpy as np
from sentence_transformers import SentenceTransformer
import os

# Define the output directory for model files
MODEL_DIR = '../models' # This goes one level up from /scripts and into /models

# Create the 'models' directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)
print(f"Directory '{MODEL_DIR}' ensured.")

# In a real app, you would fetch this from your MongoDB 'Template' collection
templates = [
    {"id": "t1", "name": "Startup Funding Announcement", "category": "Milestone"},
    {"id": "t2", "name": "Leadership Tip of the Week", "category": "Leadership"},
    {"id": "t3", "name": "Behind the Scenes at Our Company", "category": "Culture"},
    {"id": "t4", "name": "New Product Feature Launch", "category": "Product"},
]
template_texts = [f"{t['name']}: {t['category']}" for t in templates]
template_ids = [t['id'] for t in templates]

print("Loading Sentence-BERT model (this may take a moment on first run)...")
model = SentenceTransformer('all-MiniLM-L6-v2')

print("Encoding templates into vector embeddings...")
template_embeddings = model.encode(template_texts, convert_to_tensor=False)

# Save the embeddings and their corresponding IDs to files
np.save(os.path.join(MODEL_DIR, 'template_embeddings.npy'), template_embeddings)
np.save(os.path.join(MODEL_DIR, 'template_ids.npy'), np.array(template_ids))

print(f"Success! Template embeddings saved in '{MODEL_DIR}'.")