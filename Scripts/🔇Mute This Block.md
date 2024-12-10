
```python
import os
import iohelper
import mute_map
import random

def get_current_line():
    line = iohelper.get_cursor_line()
    if line == -1:
        iohelper.notice("Failed to retrieve cursor position.")
        exit(-1)
    return line

def get_mute_marker(language):
    return mute_map.MUTE_MAP.get(language.lower(), None)

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

def toggle_mute_block(lines, block, mute_marker):
    """
    Toggles the mute marker for the specified code block.
    """
    code_start = block['start_line'] + 1
    mute_line = mute_marker + "\n"
    
    if code_start < len(lines):
        if lines[code_start].strip() == mute_marker:
            # Block is muted, remove the mute marker
            del lines[code_start]
            return lines, False
        else:
            # Block is not muted, add mute marker
            lines.insert(code_start, mute_line)
            return lines, True
    else:
        # Block is at the end of the file, add mute marker
        lines.append(mute_line)
        return lines, True

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
    current_line = get_current_line()
    if current_line == -1:
        iohelper.notice("Unable to determine the current cursor line.")
        exit(-1)
    
    # Parse all code blocks
    code_blocks = find_code_blocks(lines)
    if not code_blocks:
		obsidian.runjs('app.commands.executeCommandById("editor:toggle-fold")')
        # iohelper.notice("No code blocks found in the note.")
        exit(-1)
    
    # Identify the current code block
    current_block = None
    for block in code_blocks:
        if block['start_line'] < current_line <= block['end_line']:
            current_block = block
            break
    
    if not current_block:
		obsidian.runjs('app.commands.executeCommandById("editor:toggle-fold")')
        # iohelper.notice("Cursor is not within a code block.")
        exit(-1)
    
    language = current_block['language']
    mute_marker = get_mute_marker(language)
    
    if not mute_marker:
        iohelper.notice(f"No mute marker defined for language: {language}")
        exit(-1)
    
    lines, was_muted = toggle_mute_block(lines, current_block, mute_marker)
    
    # Write the updated content back to the note
    try:
        with open(note_path, 'w', encoding='utf-8') as f:
            f.write("".join(lines))
    except Exception as e:
        iohelper.notice(f"Failed to write to the file: {e}")
        exit(-1)
    
    if was_muted:
        iohelper.notice(f"The current {language} code block muted.")
    else:
        iohelper.notice(f"The current {language} code block unmuted.")

if __name__ == "__main__":
    main()
```
