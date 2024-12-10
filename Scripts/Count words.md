
```js
// Get the active view
const activeView = app.workspace.getActiveFileView();

if (activeView) {
    // Get the editor
    const editor = activeView.editor;
    if (editor) {
        // Get the content of the current file
        const content = editor.getValue();

        // Count English words and Chinese characters
        const englishWords = content.match(/[a-zA-Z]+/g) || [];
        const chineseChars = content.match(/[\u4e00-\u9fa5]/g) || [];
        const totalCount = englishWords.length + chineseChars.length;

        // Display the word count
        new Notice(`Total word count: ${totalCount}\n(English words: ${englishWords.length}, Chinese characters: ${chineseChars.length})`);
    } else {
        new Notice("Current active file is not a Markdown file");
    }
} else {
    new Notice('No active file found');
}
```

```python
import obsidian
obsidian.runjsf(as_script=True)
```
