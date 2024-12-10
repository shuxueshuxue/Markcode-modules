
```js
const { exec } = require('child_process');
const path = require('path');

module.exports = async (params) => {
    const { app } = params;
    const activeLeaf = app.workspace.activeLeaf;

    if (!activeLeaf) {
        console.log('No active leaf found');
        new Notice('No active note found');
        return;
    }

    const editor = activeLeaf.view.sourceMode.cmEditor;
    const cursor = editor.getCursor();

    // Check if the cursor is within a Python code block
    let isInPythonBlock = false;
    let currentLine = cursor.line;
    while (currentLine >= 0) {
        const lineContent = editor.getLine(currentLine);
        if (lineContent.trim().startsWith('```')) {
            isInPythonBlock = lineContent.trim().toLowerCase().includes('python');
            break;
        }
        currentLine--;
    }

    if (!isInPythonBlock) {
        console.log('Cursor is not within a Python code block');
        new Notice('This function only works within Python code blocks');
        return;
    }

    const line = editor.getLine(cursor.line);

    // Use a regex to find the word under the cursor
    const wordRegex = /\b\w+\b/g;
    let match;
    let word = '';

    while ((match = wordRegex.exec(line)) !== null) {
        if (match.index <= cursor.ch && wordRegex.lastIndex >= cursor.ch) {
            word = match[0];
            break;
        }
    }

    if (!word) {
        console.log('No word found under cursor');
        new Notice('No word found under cursor');
        return;
    }

    const currentFile = app.workspace.getActiveFile();
    const currentDir = path.dirname(currentFile.path);
    const outputFile = path.join(currentDir, `${word}.md`).replace(/\\/g, '/');
	const pathInModule = path.join("Modules", `${word}.md`).replace(/\\/g, '/');
	const pathInScript = path.join("Scripts", `${word}.md`).replace(/\\/g, '/');

    // Check if the file already exists (user-defined module or previously fetched)
    let existingFile = app.vault.getAbstractFileByPath(outputFile);

    if (existingFile) {
        await app.workspace.getLeaf().openFile(existingFile);
        return;
    }

    existingFile = app.vault.getAbstractFileByPath(pathInModule);

    if (existingFile) {
        await app.workspace.getLeaf().openFile(existingFile);
        return;
    }

    existingFile = app.vault.getAbstractFileByPath(pathInScript);

    if (existingFile) {
        await app.workspace.getLeaf().openFile(existingFile);
        return;
    }

    // If the file doesn't exist, attempt to fetch the Python module source
    const absoluteOutputFile = path.join(app.vault.adapter.basePath, outputFile).replace(/\\/g, '/');
    const scriptPath = path.join(app.vault.adapter.basePath, 'Scripts', 'fetch_module_source.py').replace(/\\/g, '/');

    exec(`python "${scriptPath}" ${word} "${absoluteOutputFile}"`, async (error, stdout, stderr) => {
        if (error) {
            if (error.code === 1) {
                console.log(`'${word}' is not an installed Python module or user-defined module.`);
                new Notice(`'${word}' is not an installed Python module or user-defined module.`);
            } else {
                console.error(`Error: ${error.message}`);
                new Notice(`Error: ${error.message}`);
            }
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            new Notice(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
        new Notice(stdout.trim());

        // Wait for a short time to allow file system events to propagate
        await new Promise(resolve => setTimeout(resolve, 500));

        // Open the newly created file
        try {
            const maxRetries = 5;
            for (let i = 0; i < maxRetries; i++) {
                if (await app.vault.adapter.exists(outputFile)) {
                    const newFile = app.vault.getAbstractFileByPath(outputFile);
                    if (newFile) {
                        await app.workspace.getLeaf().openFile(newFile);
                        return;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error(`File not found after ${maxRetries} attempts: ${outputFile}`);
        } catch (e) {
            console.error(`Failed to open the new file: ${e.message}`);
            new Notice(`Failed to open the new file: ${outputFile}. Please try opening it manually.`);
        }
    });
};

```
