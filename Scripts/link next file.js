const { Notice } = require("obsidian");

const currentFile = app.workspace.getActiveFile();
if (!currentFile) {
    new Notice("No file is currently open.");
    return;
}

const mdFiles = app.vault.getMarkdownFiles();
if (mdFiles.length === 0) {
    new Notice("No .md files found in the vault.");
    return;
}

const chosenFile = await app.plugins.plugins.quickadd.api.suggester(
    mdFiles.map(file => file.path),
    mdFiles
);

if (chosenFile) {
    // Update current file
    const currentContent = await app.vault.read(currentFile);
    const currentMetadata = app.metadataCache.getFileCache(currentFile)?.frontmatter || {};
    currentMetadata.nextFile = chosenFile.path;
    
    const currentYamlMetadata = Object.entries(currentMetadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    const updatedCurrentContent = `---\n${currentYamlMetadata}\n---\n${currentContent.replace(/^---[\s\S]*?---\n*/,'')}`;
    await app.vault.modify(currentFile, updatedCurrentContent);

    // Update chosen file
    const chosenContent = await app.vault.read(chosenFile);
    const chosenMetadata = app.metadataCache.getFileCache(chosenFile)?.frontmatter || {};
    chosenMetadata.preFile = currentFile.path;
    
    const chosenYamlMetadata = Object.entries(chosenMetadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    const updatedChosenContent = `---\n${chosenYamlMetadata}\n---\n${chosenContent.replace(/^---[\s\S]*?---\n*/,'')}`;
    await app.vault.modify(chosenFile, updatedChosenContent);

    new Notice(`Bidirectional link created between ${currentFile.path} and ${chosenFile.path}`);
} else {
    new Notice("No file selected.");
}