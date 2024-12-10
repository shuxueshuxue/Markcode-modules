
```python
import obsidian
import shutil

note_path = obsidian.note_path

new_path = note_path.replace(".md", " copy.md")

try:
    shutil.copy2(note_path, new_path)
    print(f"File successfully copied to {new_path}")
except IOError as e:
    print(f"Unable to copy file. {e}")
except:
    print("Unexpected error occurred while copying file.")
```
