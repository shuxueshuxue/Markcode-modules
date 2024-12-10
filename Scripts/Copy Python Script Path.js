const path = require('path');
const fs = require('fs');
const editor = app.workspace.activeLeaf.view.sourceMode.cmEditor;
const selection = editor.getSelection();

const activeFile = app.workspace.getActiveFile();

if (!activeFile) {
	new Notice('No active file found');
	return;
}

const filePath = activeFile.path;
const vaultPath = app.vault.adapter.basePath;
let fullPath = path.join(vaultPath, filePath);

if (fullPath.endsWith('.md')) {
    const pyPath = fullPath.slice(0, -3) + '.py';
    if (fs.existsSync(pyPath)) {
        fullPath = pyPath;
    }
}

await navigator.clipboard.writeText(fullPath);

new Notice('Full file path copied to clipboard');