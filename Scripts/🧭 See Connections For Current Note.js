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