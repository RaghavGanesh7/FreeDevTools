#!/usr/bin/env python3
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm
import numpy as np

# ----------------------------
# 1. Load JSON files
# ----------------------------
with open("cluster.json", "r") as f:
    cluster_data = json.load(f)

with open("cluster_output_png.json", "r") as f:
    cluster_png_data = json.load(f)

# ----------------------------
# 2. Flatten metadata into text
# ----------------------------
def flatten_file_metadata(file):
    """
    Combine metadata fields into a single string.
    Returns (text, missing_flag)
    """
    parts = []
    missing = False
    for key in ["title", "description", "keywords", "tags", "synonyms", "usecases", "emotional_cues"]:
        value = file.get(key)
        if value is None:
            missing = True
            continue
        if isinstance(value, list):
            parts.append(" ".join(value))
        elif isinstance(value, str):
            parts.append(value)
    text = " ".join(parts).strip()
    if not text:
        return None, True
    return text, missing

# ----------------------------
# 3. Prepare cluster.json texts
# ----------------------------
cluster_texts = []
cluster_keys = []

for cluster_id, cluster in cluster_data["clusters"].items():
    for file in cluster["fileNames"]:
        text, missing = flatten_file_metadata(file)
        if text is None:
            continue  # skip files with no metadata
        cluster_texts.append(text)
        # key as string for JSON
        cluster_keys.append(f"{cluster_id}/{file['fileName']}")

# ----------------------------
# 4. Prepare cluster_png.json texts
# ----------------------------
png_texts = []
png_keys_for_vectorizer = []  # only valid texts
png_results_flags = {}        # all results

for cluster_id, cluster in cluster_png_data["clusters"].items():
    for file in cluster["fileNames"]:
        key = f"{cluster_id}/{file['fileName']}"  # string key
        text, missing = flatten_file_metadata(file)
        if text is None:
            png_results_flags[key] = {
                "most_similar_cluster": None,
                "similarity_percentage": None,
                "note": "metadata missing"
            }
        else:
            png_texts.append(text)
            png_keys_for_vectorizer.append(key)

# ----------------------------
# 5. TF-IDF vectorizer
# ----------------------------
vectorizer = TfidfVectorizer(stop_words="english", max_features=50000)
vectorizer.fit(cluster_texts)

cluster_vectors = vectorizer.transform(cluster_texts)

if png_texts:
    png_vectors = vectorizer.transform(png_texts)
else:
    png_vectors = []

# ----------------------------
# 6. Compute similarity
# ----------------------------
for i, key in enumerate(tqdm(png_keys_for_vectorizer, desc="Computing similarity")):
    png_vec = png_vectors[i]
    sims = cosine_similarity(png_vec, cluster_vectors)[0]
    top_idx = np.argmax(sims)
    top_score = sims[top_idx] * 100

    png_results_flags[key] = {
        "most_similar_cluster": cluster_keys[top_idx],
        "similarity_percentage": round(top_score, 2),
        "note": "ok"
    }

# ----------------------------
# 7. Save results
# ----------------------------
with open("png_to_cluster_similarity.json", "w") as f:
    json.dump(png_results_flags, f, indent=2)

print("Similarity computation completed successfully!")
