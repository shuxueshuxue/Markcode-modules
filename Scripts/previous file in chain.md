
```js
module.exports = async (params) => {
    const currentFile = app.workspace.getActiveFile();
    if (!currentFile) {
        new Notice("No file is currently open.");
        return;
    }

    const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter;

    if (metadata && metadata.preFile) {
        // If preFile metadata exists, open that file
        const preFilePath = metadata.preFile;
        const preFile = app.vault.getAbstractFileByPath(preFilePath);
        
        if (preFile) {
            await app.workspace.openLinkText(preFile.path, "", false);
        } else {
            new Notice(`File not found: ${preFilePath}`);
        }
    } else {
        // If no preFile metadata, run the neighbouring-files:prev command
        await app.commands.executeCommandById('neighbouring-files:prev');
    }
}
```
