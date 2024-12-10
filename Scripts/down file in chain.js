module.exports = async (params) => {
    const currentFile = app.workspace.getActiveFile();
    if (!currentFile) {
        new Notice("No file is currently open.");
        return;
    }

    const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter;

    if (metadata && metadata.downFile) {
        // If downFile metadata exists, open that file
        const downFilePath = metadata.downFile;
        const downFile = app.vault.getAbstractFileByPath(downFilePath);
        
        if (downFile) {
            await app.workspace.openLinkText(downFile.path, "", false);
        } else {
            new Notice(`File not found: ${downFilePath}`);
        }
    } else {
    }
}