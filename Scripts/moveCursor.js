module.exports = async (params) => {
    const {app} = params;

    const editor = app.workspace.activeLeaf.view.sourceMode.cmEditor;

    const lastLine = editor.lineCount() - 1;
    const lastChar = editor.getLine(lastLine).length;
    editor.setCursor({ line: lastLine, ch: lastChar });
};