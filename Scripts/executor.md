
```python
import sys
import os
import re
import subprocess

note_path = os.environ.get('MD_FILE')
obs_vault = os.environ.get('OBS_VAULT')

# if not note_path.endswith(".md"):
    # raise Exception(f"Error: The file must have a .md extension. The file is {note_path}.")
# else:
	# print(f"File is {note_path}")

note_title = os.path.splitext(os.path.basename(note_path))[0]
note_directory = os.path.dirname(note_path)
modules_directory = os.path.join(obs_vault, 'Modules')
py_file_name = f"{note_title}.py"
hs_file_name = f"{note_title}.hs"

os.chdir(note_directory)
sys.path.append(note_directory)
sys.path.append(modules_directory)

if note_title == "code_extractor" or note_title == "executor":
    from code_extractor_basic import *
else:
    from code_extractor import *

extracted_code = extract_and_save_code(note_path, py_file_name)
if isinstance(extracted_code, dict) and note_title != "executor":
	if extracted_code.get("python") and extracted_code.get("run_python"):
		exec(extracted_code["python"])

```
