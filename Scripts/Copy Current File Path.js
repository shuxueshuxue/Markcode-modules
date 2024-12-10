const path = require('path');

module.exports = async (params) => {
    const { app } = params;
    const activeFile = app.workspace.getActiveFile();

    if (!activeFile) {
        new Notice('No active file found');
        return;
    }

    const filePath = activeFile.path;
    const vaultPath = app.vault.adapter.basePath;
    const fullPath = path.join(vaultPath, filePath);

    await navigator.clipboard.writeText(fullPath);

    new Notice('Full file path copied to clipboard');
};