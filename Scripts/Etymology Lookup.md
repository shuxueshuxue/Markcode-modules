
```js
const editor = app.workspace.activeLeaf.view.sourceMode.cmEditor;
const selection = editor.getSelection();

if (selection) {
    const plugin = app.plugins.plugins["etymology-lookup"];
    plugin.lookup(selection);
} else {
    new Notice("No text selected");
}
```

```python
import obsidian
obsidian.runjsf(as_script=True)
```