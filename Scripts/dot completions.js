async function getDotCompletions(currentInput) {
    // Get completions data
    let completionsContent;
    try {
        const file = app.vault.getAbstractFileByPath('Scripts/dot completions (data).md');
        completionsContent = await app.vault.read(file);
    } catch (error) {
        console.error('Error reading dot completions file:', error);
        return [];
    }

    // Parse the completions content
    const completions = completionsContent
        .split('\n')
        .filter(line => line.trim() !== '');

    // Remove trailing dot from input
    const prefix = currentInput.slice(0, -1);
    
    return completions
        .filter(completion => {
            // Match exact prefix or prefix followed by dot
            return completion.startsWith(prefix + '.') &&
                   completion.slice(prefix.length + 1).indexOf('.') === -1;
        })
        .map(completion => completion.slice(prefix.length + 1))
        .slice(0, 5);
}

async function processDotCompletion(currentInput) {
    const completions = await getDotCompletions(currentInput);
    
    if (completions.length > 0) {
        const showHints = await dynamicImport('/showHints.js?update=' + Date.now());
        showHints.showHints(completions);
    }
}

function setupDotTrigger() {
    function handleKeyPress(event) {
        if (event.key !== '.') return;

        // Get current editor and cursor position
        const view = app.workspace.activeLeaf?.view?.editor;
        if (!view) return;

        const cursor = view.getCursor();
        const line = view.getLine(cursor.line);
        const beforeCursor = line.slice(0, cursor.ch);

        // Match any valid identifier pattern
        const wordBeforeDot = beforeCursor.match(/[\w\d_.-]+$/)?.[0] || '';

        if (!wordBeforeDot) return;
        processDotCompletion(wordBeforeDot + '.');
    }

    // Remove existing listener if any
    document.removeEventListener('keydown', handleKeyPress);
    
    // Add new listener
    document.addEventListener('keydown', handleKeyPress);
}

// Initialize the dot trigger
setupDotTrigger();

// Re-register when a new leaf is opened
app.workspace.on('layout-change', () => {
    setupDotTrigger();
});