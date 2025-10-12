import os
import json
import re
from io import BytesIO
from urllib.parse import urlparse

import requests
from PIL import Image

url = "https://github.com/0xdwong.png"  # example

# Extract filename from URL
parsed_url = urlparse(url)
filename = os.path.basename(parsed_url.path)
# Remove extension and add .webp
name_without_ext = os.path.splitext(filename)[0]
output_filename = f"{name_without_ext}.webp"

# Create output directory if it doesn't exist
output_dir = "/home/lovestaco/hex/FreeDevTools/frontend/public/mcp/pfp"
os.makedirs(output_dir, exist_ok=True)

response = requests.get(url, stream=True)
img = Image.open(BytesIO(response.content))

# Convert to RGB (some GitHub avatars may have alpha or P mode)
img = img.convert("RGB")

# Resize to 50x50
img = img.resize((50, 50), Image.LANCZOS)

# Save as WebP with controlled size/quality
output_path = os.path.join(output_dir, output_filename)
img.save(output_path, "WEBP", quality=80, method=6, optimize=True)

print(f"Saved profile picture as: {output_path}")

# Now find and replace in JSON files
input_dir = "/home/lovestaco/hex/FreeDevTools/frontend/public/mcp/input"
replacement_url = f"/freedevtools/mcp/pfp/{name_without_ext}.webp"

# Find all JSON files in the input directory
json_files = [f for f in os.listdir(input_dir) if f.endswith('.json')]

print(f"Found {len(json_files)} JSON files to process...")

for json_file in json_files:
    file_path = os.path.join(input_dir, json_file)
    print(f"Processing {json_file}...")
    
    try:
        # Read the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count occurrences before replacement
        original_count = content.count(url)
        
        if original_count > 0:
            # Replace the URL
            updated_content = content.replace(url, replacement_url)
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print(f"  ✅ Replaced {original_count} occurrences of {url} with {replacement_url}")
        else:
            print(f"  ⚠️  No occurrences of {url} found in {json_file}")
            
    except Exception as e:
        print(f"  ❌ Error processing {json_file}: {str(e)}")

print("✅ All JSON files processed!")
