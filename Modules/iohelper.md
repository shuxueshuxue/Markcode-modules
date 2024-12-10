
```python
import sys
import os
import obsidian
import time

note_path = os.environ.get('MD_FILE')
obs_vault = os.environ.get('OBS_VAULT')

note_title = os.path.splitext(os.path.basename(note_path))[0]
note_directory = os.path.dirname(note_path)

def printh(content: str, title_name: str = "", output_file: str = ""):
    # Determine the file to read from and write to
    input_file = output_file if output_file else note_path
    
    # Resolve relative path if necessary
    if output_file and not os.path.isabs(output_file):
        output_file = os.path.abspath(output_file)
    
    # Read the content of the input file
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            lines = file.readlines()
    except FileNotFoundError:
        lines = []  # If the file doesn't exist, start with an empty list
    
    # Process the content
    if title_name:
        title_to_find = f"# {title_name}"
        title_index = -1
        in_code_block = False
        for i, line in enumerate(lines):
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
            if not in_code_block and line.strip() == title_to_find:
                title_index = i
                break
        
        if title_index != -1:
            lines.insert(title_index + 1, f"{content}\n")
        else:
            lines.append(f"\n# {title_name}\n{content}\n")
    else:
        lines.append(f"\n{content}")
    
    # Write the modified content
    with open(output_file or input_file, 'w', encoding='utf-8') as file:
        file.writelines(lines)

def inputh(title_name: str) -> str:
    content = ""
    found_title = False
    in_code_block = False
    with open(note_path, 'r', encoding='utf-8') as file:
        for line in file:
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
            
            if not found_title and not in_code_block:
                if line.strip() == f"# {title_name}":
                    found_title = True
            elif found_title:
                if not in_code_block and (line.strip() == "----" or line.strip().startswith("# ")):
                    break
                content += line
    return content.strip()

def clearh(title_name: str = "", target_file=None):
	if not target_file:
		target_file = note_path
    with open(target_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    if title_name:
        title_to_find = f"# {title_name}"
        start_index = -1
        end_index = -1
        in_code_block = False
        for i, line in enumerate(lines):
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
            if not in_code_block and line.strip() == title_to_find:
                start_index = i + 1
            elif start_index != -1 and not in_code_block and (line.strip().startswith("# ") or line.strip() == "----"):
                end_index = i
                break
        
        if start_index != -1:
            if end_index == -1:
                end_index = len(lines)
            del lines[start_index:end_index]
            lines.insert(start_index, "\n")  # Add a newline after the heading
    else:
        new_lines = []
        in_code_block = False
        for line in lines:
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
                new_lines.append(line)
            elif in_code_block:
                new_lines.append(line)
        lines = new_lines
    
    with open(target_file, 'w', encoding='utf-8') as file:
        file.writelines(lines)

def input_prompt(prompt_text: str) -> str:
    js_code = f"""
const input = await app.plugins.plugins.quickadd.api.inputPrompt(`{prompt_text}`);
return input;
"""
    return obsidian.runjs(js_code)

def notice(text: str):
	js_code = f"""
new Notice(`{text}`)
return ''
"""
	obsidian.runjs(js_code)

def get_selection():
	js_code = """
if (window.selection){
	return window.selection;
}
else {
	return app.workspace.activeEditor.getSelection()
}
"""
	return obsidian.runjs(js_code)

# This is dangerous and buggy for some reason!
def get_cursor_line():
    js_code = """
return app.workspace.activeEditor.editor.getCursor().line;
"""
    return obsidian.runjs(js_code)

def replace_selection(new_text: str):
    # Replace backticks with a unique placeholder
    safe_text = new_text.replace('`', '§BACKTICK§')
    safe_text = safe_text.replace('${', '§DOLLARBRACKET§')
    
    js_code = f"""
    const editor = app.workspace.activeEditor.editor;
    const selection = editor.getSelection();
    if (selection) {{
        // Replace placeholder back with actual backtick
        const finalText = String.raw`{safe_text}`.replace(/§BACKTICK§/g, '`').replace(/§DOLLARBRACKET§/g, String.fromCharCode(36) + String.fromCharCode(123));
        editor.replaceSelection(finalText);
        return true;
    }}
    return false;
    """
    return obsidian.runjs(js_code)

def append_cursor(text: str):
    # Replace backticks with a unique placeholder
    safe_text = text.replace('`', '§BACKTICK§')
    safe_text = safe_text.replace('${', '§DOLLARBRACKET§')
    
    js_code = f"""
    // Replace placeholder back with actual backtick
    const finalText = String.raw`{safe_text}`.replace(/§BACKTICK§/g, '`').replace(/§DOLLARBRACKET§/g, String.fromCharCode(36) + String.fromCharCode(123));
    app.workspace.activeEditor.editor.replaceRange(finalText, app.workspace.activeEditor.editor.getCursor())
    return 200
    """
    return obsidian.runjs(js_code)

def get_cursor_column():
    js_code = """
return app.workspace.activeEditor.editor.getCursor().ch;
"""
    return obsidian.runjs(js_code)

# beginning of the section of optional functions
def refreshh(title_name, refresh_function):
	content = inputh(title_name)
	clearh(title_name)
	printh(refresh_function(content), title_name)
# ending of the section of optional functions
```
