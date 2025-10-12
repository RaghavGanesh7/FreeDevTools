import json
import os
import re
from io import BytesIO
from urllib.parse import urlparse

import requests
from PIL import Image


def process_image_url(image_url, output_dir):
    """Download, process and save image, return the new URL"""
    try:
        # Extract filename from URL
        parsed_url = urlparse(image_url)
        filename = os.path.basename(parsed_url.path)
        name_without_ext = os.path.splitext(filename)[0]
        output_filename = f"{name_without_ext}.webp"

        # Download image
        response = requests.get(image_url, stream=True, timeout=10)
        response.raise_for_status()

        # Process image
        img = Image.open(BytesIO(response.content))
        img = img.convert("RGB")
        img = img.resize((50, 50), Image.LANCZOS)

        # Save as WebP
        output_path = os.path.join(output_dir, output_filename)
        img.save(output_path, "WEBP", quality=80, method=6, optimize=True)

        # Return new URL
        return f"/freedevtools/mcp/pfp/{name_without_ext}.webp"

    except Exception as e:
        print(f"    ❌ Error processing {image_url}: {str(e)}")
        return image_url  # Return original URL if processing fails


def process_json_file(file_path, output_dir):
    """Process a single JSON file"""
    print(f"Processing {os.path.basename(file_path)}...")

    try:
        # Read JSON file
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Track changes
        changes_made = 0
        unique_urls = set()

        # Find all imageUrl fields in repositories
        if "repositories" in data:
            for repo_id, repo_data in data["repositories"].items():
                if (
                    "imageUrl" in repo_data
                    and repo_data["imageUrl"]
                    and repo_data["imageUrl"].strip()
                ):
                    image_url = repo_data["imageUrl"]
                    if image_url not in unique_urls:
                        unique_urls.add(image_url)
                        print(f"  Processing image: {image_url}")

                        # Process the image
                        new_url = process_image_url(image_url, output_dir)

                        if new_url != image_url:
                            # Update all occurrences of this URL in the repo
                            repo_data["imageUrl"] = new_url
                            changes_made += 1
                            print(f"    ✅ Updated to: {new_url}")

        if changes_made > 0:
            # Write back to file
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"  ✅ Updated {changes_made} image URLs")
        else:
            print(f"  ⚠️  No image URLs found to process")

    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {str(e)}")


def main():
    # Setup directories
    input_dir = "/home/lovestaco/hex/FreeDevTools/frontend/public/mcp/input"
    output_dir = "/home/lovestaco/hex/FreeDevTools/frontend/public/mcp/pfp"

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Find all JSON files
    json_files = [f for f in os.listdir(input_dir) if f.endswith(".json")]
    print(f"Found {len(json_files)} JSON files to process...")

    # Process each JSON file
    for json_file in json_files:
        file_path = os.path.join(input_dir, json_file)
        process_json_file(file_path, output_dir)

    print("✅ All JSON files processed!")


if __name__ == "__main__":
    main()
