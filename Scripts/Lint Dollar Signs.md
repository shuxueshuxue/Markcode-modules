
```python
import obsidian
js_code = """
app.commands.executeCommandById("math-indicator-changer:change-math-indicator");
"""
obsidian.runjs(js_code)
obsidian.save_edit()
```

```python
import fileUtils
import iohelper
content = fileUtils.get_file_content()

modified = ""
for line in content.split("\n"):
	if line.strip() == "$$":
		modified += line.strip() + "\n"
	else:
		modified += line + "\n"

note_path = os.environ.get('MD_FILE')
with open(note_path, "w", encoding="utf-8") as f:
	f.write(modified)
```

```python
import time
time.sleep(0.5)

obsidian.refresh_view()
js_code = """
app.commands.executeCommandById("obsidian-linter:lint-file");
"""
obsidian.runjs(js_code)
```
