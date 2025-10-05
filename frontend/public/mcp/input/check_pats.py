import re
import os
import json

# Regex patterns for common secrets
patterns = {
    "GitHub PAT": r"ghp_[A-Za-z0-9]{36}",
    "HuggingFace": r"hf_[A-Za-z0-9]{40}",
    "AWS": r"AKIA[0-9A-Z]{16}",
    "Salesforce": r"(?i)client_secret|consumer_key|consumer_secret"
}

folder = "."

for filename in os.listdir(folder):
    if filename.endswith(".json"):
        path = os.path.join(folder, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                for name, pattern in patterns.items():
                    if re.search(pattern, content):
                        print(f"[!] {name} found in {filename}")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
