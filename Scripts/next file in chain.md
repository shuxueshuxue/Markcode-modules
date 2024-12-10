
```js
module.exports = async (params) => {
    const currentFile = app.workspace.getActiveFile();
    if (!currentFile) {
        new Notice("No file is currently open.");
        return;
    }

    const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter;

    if (metadata && metadata.nextFile) {
        // If nextFile metadata exists, open that file
        const nextFilePath = metadata.nextFile;
        const nextFile = app.vault.getAbstractFileByPath(nextFilePath);
        
        if (nextFile) {
            await app.workspace.openLinkText(nextFile.path, "", false);
        } else {
            new Notice(`File not found: ${nextFilePath}`);
        }
    } else {
        // If no nextFile metadata, run the neighbouring-files:nextv command
        await app.commands.executeCommandById('neighbouring-files:next');
    }
}
```
