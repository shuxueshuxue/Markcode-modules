
```python
import pyperclip
import obsidian

env_commands = f'''$env:MD_FILE = "{obsidian.note_path}";$env:OBS_VAULT = "{obsidian.obs_vault}";$env:SCRIPT_MODE = "False";'''

jump_and_run = rf'''cd "{obsidian.obs_vault}\Notes";python "Mirai Project alpha.py";'''

final_commands = env_commands + jump_and_run

pyperclip.copy(final_commands)
```
