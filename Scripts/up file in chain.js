module.exports = async (params) => {
    const currentFile = app.workspace.getActiveFile();
    if (!currentFile) {
        new Notice("No file is currently open.");
        return;
    }

    const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter;

    if (metadata && metadata.upFile) {
        // If upFile metadata exists, open that file
        const upFilePath = metadata.upFile;
        const upFile = app.vault.getAbstractFileByPath(upFilePath);
        
        if (upFile) {
            await app.workspace.openLinkText(upFile.path, "", false);
        } else {
            new Notice(`File not found: ${upFilePath}`);
        }
    } else {
    }
}