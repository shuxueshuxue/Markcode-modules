---
preFile: Scripts/(ai) add note title.md
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
prompt = f"""Given the following note content, suggest relevant bookmarks/tags that describe the content.
Return only 3-5 relevant tags in this format: #tag1 #tagTwo #tagThree
Tags should use camelCase for word separation, lowercase first letter. Only respond with the tags, nothing else.

Note content:
{content}"""

# Get bookmark suggestions from Claude
suggested_bookmarks = claude_chat.call_claude_api(prompt).strip()

# Update bookmarks
lines = content.split('\n')
if lines[0].startswith('#'):
    # If first line has bookmarks, replace them
    lines[0] = suggested_bookmarks
    new_content = '\n'.join(lines)
else:
    # Add bookmarks as new first line  
    new_content = suggested_bookmarks + '\n' + content

# Write updated content back to file
with open(note_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Bookmarks added successfully!")
```
