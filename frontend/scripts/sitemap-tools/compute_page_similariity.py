#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys

def fetch_html_text(url):
    """Fetch and clean HTML text from a URL."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""
    
    soup = BeautifulSoup(response.text, "html.parser")

    # Remove script and style
    for tag in soup(["script", "style", "noscript"]):
        tag.extract()

    # Get visible text
    text = soup.get_text(separator=" ")
    text = " ".join(text.split())  # normalize whitespace
    return text

def compute_similarity(text1, text2):
    """Compute similarity percentage between two texts."""
    if not text1 or not text2:
        return 0.0
    
    vectorizer = TfidfVectorizer().fit([text1, text2])
    tfidf_matrix = vectorizer.transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    return round(similarity * 100, 2)

def main():
    if len(sys.argv) != 3:
        print("Usage: python compare_html.py <url1> <url2>")
        sys.exit(1)

    url1, url2 = sys.argv[1], sys.argv[2]

    print(f"Fetching content from:\n- {url1}\n- {url2}")

    text1 = fetch_html_text(url1)
    text2 = fetch_html_text(url2)

    similarity = compute_similarity(text1, text2)

    print(f"\nSimilarity between pages: {similarity}%")

if __name__ == "__main__":
    main()
