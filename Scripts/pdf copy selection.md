
```js
document.addEventListener("keydown", (event) => {
  // Check if Ctrl+C is pressed
  if (event.ctrlKey && event.key === "a") {

    // Get the active leaf
    const activeLeaf = app.workspace.activeLeaf;

    // Check if the active leaf exists and is a PDF view
    if (activeLeaf && activeLeaf.view.getViewType() === "pdf") {
      // Execute the PDF copy link command
      app.commands.executeCommandById("pdf-plus:copy-link-to-selection");
      // Prevent default copy behavior for PDF
      event.preventDefault();
    }
    // For non-PDF files, do nothing and let the default copy behavior work
  }
});

```

```js
const vim = window.CodeMirrorAdapter?.Vim;
vim.map("<C-c>", ":executeCommand execute-script-🧹-clear-section");

// Register the custom Ex command
vim.defineEx("executeCommand", "", (cm, params) => {
  app.commands.executeCommandById(params.args);
});

```

