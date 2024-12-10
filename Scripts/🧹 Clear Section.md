```python
import iohelper
note_path = iohelper.note_path
cursor_line = iohelper.get_cursor_line()

title = ""
with open(note_path, "r+", encoding="utf-8") as f:
	file_lines = f.readlines()
	for index, line in enumerate(file_lines[:cursor_line + 1]):
		if line.strip().startswith("# ") and line.count("#")==1:
			title = line.strip()

if title:
	iohelper.clearh(title.replace("# ", ""))
else:
	print("Not inside of any section.")
```