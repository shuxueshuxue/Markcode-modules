function setupHintKeyHandler() {
    function handleKeyPress(event) {
        // First check for custom hint container
        const hintContainer = document.querySelector('.custom-hint-container');
        if (hintContainer) {
            // Handle custom hints
            if (event.key >= '1' && event.key <= '9') {
                const num = parseInt(event.key);
                const hintItems = hintContainer.querySelectorAll('.custom-hint-item');
                
                if (num <= hintItems.length) {
                    const selectedItem = hintItems[num - 1];
                    const content = selectedItem.textContent.replace(/^\[\d+\]\s*/, '');
                    
                    const view = app.workspace.activeLeaf.view.editor;
                    const cursor = view.getCursor();
                    view.replaceRange(content, cursor);
                    
                    const newPosition = {
                        line: cursor.line,
                        ch: cursor.ch + content.length
                    };
                    view.setCursor(newPosition);
                    
                    hintContainer.remove();
                    event.preventDefault();
                }
            } else {
                hintContainer.remove();
                return;
            }
        } else {
            // Check for Obsidian's suggestion container
            const suggestionContainer = document.querySelector('.suggestion-container');
            if (suggestionContainer) {
                if (event.key >= '1' && event.key <= '9') {
                    const num = parseInt(event.key);
                    const suggestionItems = suggestionContainer.querySelectorAll('.suggestion-item');
                    
                    if (num <= suggestionItems.length) {
                        // Simulate click on the selected suggestion
                        suggestionItems[num - 1].click();
                        event.preventDefault();
                    }
                }
            }
        }
    }

    // Remove existing listener if any
    document.removeEventListener('keydown', handleKeyPress);
    // Add new listener
    document.addEventListener('keydown', handleKeyPress);
}

setupHintKeyHandler();