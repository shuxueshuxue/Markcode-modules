
```js
let embeddingResult = window.embeddingResult;

// Function to create and show floating message
function showSimilarityResults(embeddingResult) {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '5%';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.padding = '20px';
    container.style.backgroundColor = 'var(--background-primary)';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '9999';
    container.style.maxHeight = '80%';
    container.style.overflow = 'auto';
    container.style.color = 'var(--text-normal)';
    container.style.maxWidth = '90vw';

    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Semantic Similarity Results';
    header.style.marginBottom = '15px';
    container.appendChild(header);

    // Parse the results
    const lines = embeddingResult.split('\n').filter(line => line.trim());
    
    // Create results list
    const resultsList = document.createElement('div');
    resultsList.style.display = 'flex';
    resultsList.style.flexDirection = 'column';
    resultsList.style.gap = '10px';

    lines.slice(1).forEach(line => {
        if (line.includes(':')) {
            const [filename, score] = line.split(':').map(s => s.trim());
            
            const resultItem = document.createElement('div');
            resultItem.style.display = 'flex';
            resultItem.style.justifyContent = 'space-between';
            resultItem.style.alignItems = 'center';
            resultItem.style.padding = '8px';
            resultItem.style.backgroundColor = 'var(--background-secondary)';
            resultItem.style.borderRadius = '4px';
            resultItem.style.cursor = 'pointer';
            
            // Filename
            const filenameSpan = document.createElement('span');
            filenameSpan.textContent = filename;
            
            // Score bar
            const scoreContainer = document.createElement('div');
            scoreContainer.style.display = 'flex';
            scoreContainer.style.alignItems = 'center';
            scoreContainer.style.gap = '10px';
            
            const scoreBar = document.createElement('div');
            scoreBar.style.width = '100px';
            scoreBar.style.height = '8px';
            scoreBar.style.backgroundColor = 'var(--background-modifier-border)';
            scoreBar.style.borderRadius = '4px';
            
            const scoreValue = parseFloat(score);
            const scoreIndicator = document.createElement('div');
            scoreIndicator.style.width = `${scoreValue * 100}%`;
            scoreIndicator.style.height = '100%';
            scoreIndicator.style.backgroundColor = 'var(--interactive-accent)';
            scoreIndicator.style.borderRadius = '4px';
            
            const scoreText = document.createElement('span');
            scoreText.textContent = scoreValue.toFixed(3);
            scoreText.style.fontSize = '0.9em';
            
            scoreBar.appendChild(scoreIndicator);
            scoreContainer.appendChild(scoreBar);
            scoreContainer.appendChild(scoreText);
            
            resultItem.appendChild(filenameSpan);
            resultItem.appendChild(scoreContainer);
            
            // Add click handler to open the file
            resultItem.addEventListener('click', () => {
                app.workspace.openLinkText(filename, '');
            });
            
            resultsList.appendChild(resultItem);
        }
    });

    container.appendChild(resultsList);
    
    // Add to document
    document.body.appendChild(container);

    // Remove after some time (optional)
    // setTimeout(() => {
        // container.style.opacity = '0';
        // setTimeout(() => {
            // document.body.removeChild(container);
        // }, 200);
    // }, 10000);
}

if (embeddingResult) {
    showSimilarityResults(embeddingResult);
}
```

```python
import os
import json
import embedding_similarity
import obsidian
import fileUtils
import iohelper

def ensure_json_exists(json_path):
    """Create JSON file if it doesn't exist"""
    if not os.path.exists(json_path):
        with open(json_path, 'w', encoding="utf-8") as f:
            json.dump({}, f)

def get_similar_files():
    try:
        note_path = os.environ.get('MD_FILE')
        if not note_path:
            iohelper.notice("Error: Note path not found")
            return
            
        note_title = os.path.splitext(os.path.basename(note_path))[0]
        current_file_content = fileUtils.get_file_content(note_title+".md")
        
        if not current_file_content.strip():
            iohelper.notice("Warning: Current file is empty")
            return

        json_path = os.path.join(obsidian.obs_vault, "embeddings.json")
        ensure_json_exists(json_path)

        # Load existing embeddings
        with open(json_path, encoding="utf-8") as f:
            json_data = json.load(f)

        # Get embedding for current note
        try:
            current_embedding = embedding_similarity.get_embedding(current_file_content)
        except Exception as e:
            iohelper.notice(f"Error getting embedding: {str(e)}")
            return

        # Update json with current note's embedding
        relative_path = os.path.relpath(note_path, obsidian.obs_vault)
        json_data[relative_path] = current_embedding

        # Save updated embeddings
        with open(json_path, 'w', encoding="utf-8") as f:
            json.dump(json_data, f)

        # Calculate similarities with all other notes
        similarities = []
        for path, embedding in json_data.items():
            if path != relative_path:  # Skip comparing with self
                if path.endswith('.md'):  # Only compare with markdown files
                    try:
                        score = embedding_similarity.cosine_similarity(current_embedding, embedding)
                        similarities.append((path, score))
                    except Exception as e:
                        print(f"Error calculating similarity for {path}: {str(e)}")
                        continue

        if not similarities:
            iohelper.notice("No other files found for comparison")
            return

        # Sort by similarity score in descending order
        similarities.sort(key=lambda x: x[1], reverse=True)

        # Display top 8 (or fewer) similar files
        message = "Most similar files:\n\n"
        display_count = min(10, len(similarities))
        
        for path, score in similarities[:display_count]:
            filename = os.path.splitext(os.path.basename(path))[0]
            message += f"{filename}: {score:.3f}\n"

        return message

    except Exception as e:
        iohelper.notice(f"An error occurred: {str(e)}")

def maintenance():
    json_path = os.path.join(obsidian.obs_vault, "embeddings.json")
    ensure_json_exists(json_path)
    
    with open(json_path, encoding="utf-8") as f:
        json_data = json.load(f)
        
    missing_files = []
    for path in list(json_data.keys()):
        full_path = os.path.join(obsidian.obs_vault, path)
        if not os.path.exists(full_path):
            missing_files.append(path)
            
    if len(missing_files) > 100:
        for path in missing_files:
            print(f"Missing file: {path}")
        iohelper.notice(f"Warning: {len(missing_files)} files not found. Too many to auto-delete.")
        return
        
    for path in missing_files:
        del json_data[path]
        
    if missing_files:
        with open(json_path, 'w', encoding="utf-8") as f:
            json.dump(json_data, f)
        iohelper.notice(f"Removed {len(missing_files)} missing files from embeddings.json")	

# Run the function
result = get_similar_files()
# Then store the result in the global scope and run the js code in the js block above.
obsidian.runjs(f"window.embeddingResult = `{result}`;")
obsidian.runjsf()

maintenance()
```
