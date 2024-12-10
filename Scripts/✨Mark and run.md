
```python
#!
import os
import iohelper
import shebang_map  # The mapping we defined earlier
import random
import obsidian

def get_current_line():
    line = iohelper.get_cursor_line()
    if line == -1:
        iohelper.notice("Failed to retrieve cursor position.")
        exit(-1)
    return line

def get_shebang_marker(language):
    return shebang_map.SHEBANG_MAP.get(language.lower(), None)

def find_code_blocks(lines):
    """
    Parses the note content and identifies all code blocks.
    
    Returns a list of dictionaries with start_line, end_line, and language.
    """
    code_blocks = []
    in_code_block = False
    start_line = 0
    language = ''

    for i, line in enumerate(lines):
        if line.strip().startswith("```"):
            if not in_code_block:
                in_code_block = True
                start_line = i
                parts = line.strip().split('```')
                language = parts[1] if len(parts) > 1 else ''
            else:
                in_code_block = False
                end_line = i
                code_blocks.append({
                    'start_line': start_line,
                    'end_line': end_line,
                    'language': language
                })
                language = ''
                
    return code_blocks

def remove_all_shebangs(lines, code_blocks):
    """
    Removes shebang markers from all code blocks.
    """
    shebang_lines_to_remove = []
    for block in code_blocks:
        shebang_marker = get_shebang_marker(block['language'])
        if shebang_marker:
            code_start = block['start_line'] + 1
            if code_start < len(lines) and lines[code_start].strip().startswith(shebang_marker):
                shebang_lines_to_remove.append(code_start)
    
    # Remove lines in reverse order to prevent shifting
    for line_num in sorted(shebang_lines_to_remove, reverse=True):
        del lines[line_num]
    
    return lines

def assign_shebang_to_block(lines, block, shebang_marker):
    """
    Assigns the shebang marker to the specified code block.
    """
    code_start = block['start_line'] + 1
    shebang_line = shebang_marker + "\n"
    
    # Insert shebang marker as the first line inside the code block
    if code_start < len(lines):
        if lines[code_start].strip().startswith("#!"):
            lines[code_start] = shebang_line
        else:
            lines.insert(code_start, shebang_line)
    else:
        # Edge case: code block is empty, just add shebang
        lines.append(shebang_line)
    
    return lines

def main():
    note_path = os.environ.get('MD_FILE')
    if not note_path:
        iohelper.notice("MD_FILE environment variable not set.")
        exit(-1)
    
    # Read the note content
    try:
        with open(note_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        iohelper.notice(f"Failed to read the file: {e}")
        exit(-1)
    
    # Get the current cursor line
    # current_line = 5
    current_line = get_current_line()
    if current_line == -1:
        iohelper.notice("Unable to determine the current cursor line.")
        exit(-1)
    
    # Parse all code blocks
    code_blocks = find_code_blocks(lines)
    if not code_blocks:
        iohelper.notice("No code blocks found in the note.")
        exit(-1)
    
	# iohelper.printh(code_blocks)
    # Remove all existing shebang markers
    lines = remove_all_shebangs(lines, code_blocks)
	# return

    # Re-parse code blocks as the lines have been modified
    code_blocks = find_code_blocks(lines)
    
    # Identify the current code block
    current_block = None
    for block in code_blocks:
        if block['start_line'] < current_line <= block['end_line']:
            current_block = block
            break
    
    if not current_block:
        iohelper.notice("Cursor is not within a code block.")
        exit(-1)
    
    # Get the language and corresponding shebang marker
    language = current_block['language']
    shebang_marker = get_shebang_marker(language)
    
    if not shebang_marker:
        iohelper.notice(f"No shebang marker defined for language: {language}")
        exit(-1)
    
    # Assign shebang to the current block
    lines = assign_shebang_to_block(lines, current_block, shebang_marker)
    
    # Write the updated content back to the note
    try:
		with open(note_path, 'w', encoding='utf-8') as f:
			f.write("".join(lines))
    except Exception as e:
        iohelper.notice(f"Failed to write to the file: {e}")
        exit(-1)
    
    iohelper.notice(f"Assigned shebang to the current {language} code block.")

if __name__ == "__main__":
    main()
    obsidian.executeCode() # execute the code in the note file
```
