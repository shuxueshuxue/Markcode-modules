module.exports = async (params) => {
    
    const { app } = params;
    const activeLeaf = app.workspace.activeLeaf;

    if (!activeLeaf) {
        new Notice('No active note found');
        return;
    }

    const editor = activeLeaf.view.sourceMode.cmEditor;
    const cursor = editor.getCursor();

    // Function to check if a line is a code block delimiter
    const isCodeBlockDelimiter = (line) => /^```\w*$/.test(line.trim());

    // Find the start of the code block
    let startLine = cursor.line;
    while (startLine > 0 && !isCodeBlockDelimiter(editor.getLine(startLine))) {
        startLine--;
    }

    // If we didn't find a start delimiter, we're not in a code block
    if (startLine === 0 && !isCodeBlockDelimiter(editor.getLine(startLine))) {
        new Notice('Cursor is not in a code block');
        return;
    }

    // Find the end of the code block
    let endLine = cursor.line;
    const lastLine = editor.lineCount() - 1;
    while (endLine < lastLine && !isCodeBlockDelimiter(editor.getLine(endLine))) {
        endLine++;
    }

    // If we didn't find an end delimiter, we're not in a properly formatted code block
    if (endLine === lastLine && !isCodeBlockDelimiter(editor.getLine(endLine))) {
        new Notice('Cursor is not in a properly formatted code block');
        return;
    }

    // Extract the code block content
    const codeBlockContent = editor.getRange(
        { line: startLine + 1, ch: 0 },
        { line: endLine, ch: 0 }
    );

    // Copy to clipboard
    await navigator.clipboard.writeText(codeBlockContent);

    new Notice('Code block copied to clipboard');
};