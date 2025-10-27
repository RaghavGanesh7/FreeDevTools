# MCP Duplicate Removal Logic

## Overview

This document explains how the `remove-duplicates.js` script detects and removes duplicate MCP (Model Context Protocol) repositories across multiple categories using semantic similarity analysis.

## Problem Statement

MCP repositories were appearing in multiple categories, leading to:
- Inflated repository counts
- Confusion about which category best fits each repository
- Redundant data across category files

**Example:** A repository like `mysql-mcp` might appear in:
- `apis-and-http-requests`
- `databases`
- `developer-tools`

## Solution Approach

### 1. Duplicate Detection

The script scans all category JSON files in `/frontend/public/mcp/input/` and builds a map of repositories:

```javascript
// Each repository is identified by: owner--name
// Example: "11bluetree--mysql-mcp"

Map {
  "11bluetree--mysql-mcp": {
    repoId: "11bluetree--mysql-mcp",
    categories: ["apis-and-http-requests", "databases", "developer-tools"],
    data: { name, description, owner, ... }
  }
}
```

**Duplicate Criteria:** Any repository appearing in 2+ categories is considered a duplicate.

### 2. Semantic Similarity Analysis

Instead of simple keyword matching, the script uses **AI-powered semantic embeddings** to understand the meaning and context of repositories and categories.

#### Embedding Model

- **Model:** `Xenova/all-MiniLM-L6-v2` via Hugging Face Transformers
- **Type:** Sentence embeddings (384-dimensional vectors)
- **Purpose:** Convert text into numerical vectors that capture semantic meaning

#### How It Works

**Step 1: Generate Repository Embedding**
```javascript
const repoText = `${repo.name} ${repo.description}`;
const repoEmbedding = await getEmbedding(repoText);
// Example: "mysql-mcp A server for interacting with MySQL databases"
// → [0.234, -0.891, 0.456, ..., 0.123] (384 dimensions)
```

**Step 2: Generate Category Embeddings**
```javascript
const categoryText = `${category.category} ${category.categoryDisplay} ${category.description}`;
const categoryEmbedding = await getEmbedding(categoryText);
// Example: "databases Databases Tools for database management"
// → [0.198, -0.823, 0.512, ..., 0.234] (384 dimensions)
```

**Step 3: Calculate Cosine Similarity**
```javascript
similarity = dot(repoVector, categoryVector) / (||repoVector|| × ||categoryVector||)
// Range: -1 to 1 (higher = more similar)
```

**Example Scores:**
```javascript
{
  "apis-and-http-requests": 0.0785,  // Low similarity
  "databases": 0.5785,                // High similarity ✓
  "developer-tools": 0.3418           // Medium similarity
}
```

### 3. Category Selection Logic

```javascript
function findBestCategory(repo, categoriesWhereFound, categoryData) {
  const scores = {};
  
  // Calculate similarity for each category
  for (const category of categoriesWhereFound) {
    const similarity = cosineSimilarity(repoEmbedding, categoryEmbedding);
    scores[category] = similarity;
  }
  
  // Select category with highest score
  let bestCategory = categoriesWhereFound[0];  // Default to first
  let highestScore = scores[bestCategory];
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }
  
  return { bestCategory, scores };
}
```

**Tie-Breaking:** If multiple categories have identical scores, the script keeps the first category in alphabetical order.

### 4. Removal Process

1. **Scan** all category files
2. **Identify** repositories appearing in multiple categories
3. **Calculate** semantic similarity scores for each category
4. **Determine** best-fit category (highest similarity score)
5. **Remove** repository from all other categories
6. **Update** `totalRepositories` count in each modified file
7. **Save** updated category files
8. **Generate** CSV report with detailed removal log

## Output

### Console Report

```
============================================================
📊 DUPLICATE REMOVAL REPORT
============================================================

📥 BEFORE Cleanup:
   • Unique repositories: 5,528
   • Total entries (with duplicates): 13,231
   • Repositories appearing in 2+ categories: 4,338

🗑️  REMOVED:
   • Duplicate entries removed: 7,703
   • Categories modified: 70

📤 AFTER Cleanup:
   • Unique repositories: 5,528 (unchanged)
   • Total entries (deduplicated): 5,528
   • Each repository now appears in exactly 1 category

📈 Impact:
   • Reduction: 58.2% (removed 7,703 of 13,231 entries)
   • Space saved: 58% of original size

✅ Report saved to: duplicate-removal-report.csv
============================================================
```

### CSV Report Structure

The CSV report (`duplicate-removal-report.csv`) contains:

**Header Section:**
```csv
=== DUPLICATE REMOVAL REPORT ===

BEFORE Cleanup:
Unique repositories,5528
Total entries (with duplicates),13231
...

=== DETAILED REMOVAL LOG ===
```

**Data Columns:**
| Column | Description |
|--------|-------------|
| Repository Name | Name of the repository |
| Owner | GitHub username/organization |
| Removed From | Category the repo was removed from |
| Removed From Score | Similarity score for removed category |
| Kept In | Category where repo was kept |
| Kept In Score | Similarity score for kept category |
| All Scores | JSON object with all category scores |
| Method | Detection method (always "semantic") |

**Example Row:**
```csv
"mysql-mcp","11bluetree","apis-and-http-requests","0.0785","databases","0.5785","{""apis-and-http-requests"":0.0785,""databases"":0.5785,""developer-tools"":0.3418}","semantic"
```

This shows:
- `mysql-mcp` was **removed from** `apis-and-http-requests` (score: 0.0785)
- It was **kept in** `databases` (score: 0.5785)
- The `databases` category had the highest similarity score

## Why Semantic Similarity?

### Traditional Keyword Matching Issues

❌ **Simple Keywords:** Would require maintaining extensive keyword lists for each category
❌ **Brittle:** Misses synonyms and related concepts (e.g., "DB" vs "database")
❌ **Context-Blind:** Can't understand phrases like "time-series database" vs "database management"

### Semantic Similarity Advantages

✅ **Understanding Context:** Embeddings capture meaning, not just words
✅ **Synonym Detection:** "MySQL server" and "database management" are semantically similar
✅ **Multi-word Comprehension:** Understands "API for financial data" vs "financial analytics platform"
✅ **No Manual Rules:** AI model learned from millions of text examples
✅ **Consistent:** Same logic applied to all 5,000+ repositories

## Technical Implementation

### Dependencies

```json
{
  "@huggingface/transformers": "^3.7.2"
}
```

### Key Functions

1. **`getEmbedder()`** - Lazy loads the embedding model
2. **`getEmbedding(text)`** - Converts text to 384-dimensional vector
3. **`cosineSimilarity(vecA, vecB)`** - Calculates similarity between vectors
4. **`findBestCategory()`** - Determines best-fit category using embeddings
5. **`removeDuplicates()`** - Main orchestration function

### Performance Considerations

- **Model Loading:** ~100-200MB, loaded once and cached
- **Embedding Generation:** ~50-100ms per text
- **Total Runtime:** ~10-15 minutes for 5,000+ repositories
- **Concurrency:** Sequential processing to avoid memory issues

## Running the Script

```bash
cd frontend
node scripts/remove-duplicates.js
```

### Prerequisites

1. Node.js 22.17.0+
2. All dependencies installed (`npm install`)
3. Category JSON files in `/frontend/public/mcp/input/`

### What Gets Modified

- ✏️ All category JSON files (removes duplicates)
- 📝 Creates `duplicate-removal-report.csv`
- 🔢 Updates `totalRepositories` count in each file

## Example: Decision Walkthrough

**Repository:** `mysql-mcp` by `11bluetree`

**Found in:**
- apis-and-http-requests
- databases  
- developer-tools

**Repository Text:**
```
"mysql-mcp A server for interacting with MySQL databases through MCP protocol"
```

**Similarity Scores:**
```javascript
{
  "apis-and-http-requests": 0.0785,   // Low - not primarily an API
  "databases": 0.5785,                 // High - clearly database-related ✓
  "developer-tools": 0.3418            // Medium - is a tool, but not the main purpose
}
```

**Decision:** Keep in `databases` (highest score: 0.5785)

**Actions:**
- ❌ Remove from `apis-and-http-requests.json`
- ✅ Keep in `databases.json`
- ❌ Remove from `developer-tools.json`

## Validation

### How to Verify Results

1. **Check CSV Report:** Review similarity scores for removed entries
2. **Sample Spot Checks:** Manually verify 20-30 repositories make sense
3. **Score Distribution:** Most kept categories should have scores > 0.3
4. **Category Counts:** Each category should have reasonable repository count

### Quality Metrics

- **High Confidence:** Kept category score > 0.5
- **Medium Confidence:** Kept category score 0.3 - 0.5
- **Low Confidence:** Kept category score < 0.3 (may need manual review)

## Future Improvements

1. **Manual Overrides:** Allow specifying preferred categories for specific repos
2. **Multi-Category Support:** Some repos genuinely belong in 2 categories
3. **Confidence Thresholds:** Flag low-confidence decisions for review
4. **Category Descriptions:** Improve category descriptions for better matching
5. **Repository README:** Use full README content instead of just description

## Troubleshooting

### Model Not Loading
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### Out of Memory
- Process repositories in batches
- Reduce concurrent operations
- Use `--max-old-space-size=4096` Node flag

### Unexpected Results
- Review category descriptions in JSON files
- Check repository descriptions are meaningful
- Examine similarity scores in CSV for edge cases

## Related Files

- `/frontend/scripts/remove-duplicates.js` - Main script
- `/frontend/public/mcp/input/*.json` - Category data files
- `/frontend/public/mcp/duplicate-removal-report.csv` - Output report

