---
nextFile: Scripts/(ai) add note bookmarks.md
---

```python
import os
import claude_chat
import iohelper
import fileUtils

# Get current note path and content
note_path = os.environ.get('MD_FILE')
note_title = os.path.splitext(os.path.basename(note_path))[0]
content = fileUtils.get_file_content(note_title + ".md")

# Prepare prompt for Claude
prompt = f"""Given the following note content, suggest a concise and descriptive filename (without .md extension).
The filename should be clear, meaningful, and follow proper naming conventions (use hyphens for spaces, lowercase).
Only respond with the suggested filename, nothing else.

Note content:
{content}"""

# Get new filename suggestion from Claude
new_filename = claude_chat.call_claude_api(prompt).strip()

# Add .md extension
new_filename = new_filename + ".md"

# Get directory path
dir_path = os.path.dirname(note_path)

# Construct new full path
new_path = os.path.join(dir_path, new_filename)

# Confirm with user
confirmation = iohelper.input_prompt(f"Suggested filename: {new_filename} (y/n)").strip().lower()

if confirmation == 'y':
    try:
        # Rename the file
        os.rename(note_path, new_path)
        print(f"File renamed successfully to: {new_filename}")
        
    except Exception as e:
        print(f"Error renaming file: {str(e)}")
else:
    print("Rename cancelled.")

```