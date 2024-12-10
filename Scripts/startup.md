
The print content will be at [startupLogging](startupLogging.md).

<!-- nr -->

```python
import time
import os
import sys

obs_vault = os.environ.get('vaultPath')
if not obs_vault:
	obs_vault = "D:/NotesParent"
modules_directory = os.path.join(obs_vault, 'Modules')
scripts_directory = os.path.join(obs_vault, 'Scripts')

os.chdir(obs_vault)
sys.path.append(scripts_directory)
sys.path.append(modules_directory)

import obsidian
import iohelper

initialized = obsidian.initialize()
if initialized:
	iohelper.printh("Successfully launched. Date: " + time.ctime())
	obsidian.runjs("window.scriptFile = ''; return 100;")
	obsidian.runjsf(os.path.join(scripts_directory, "Script Hotkey Manager.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "handleNumberKey.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "Hint Keyboard Listen.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "dot completions.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "Tweaks.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "setting menu quick switcher.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "remove semantic search result.js"))
	obsidian.runjsf(os.path.join(scripts_directory, "pdf copy selection.js"))
	# obsidian.runjsf(os.path.join(scripts_directory, "Surfing focus.js"))
else:
	iohelper.printh("Obsidian server failed to launch. Date: " + time.ctime())

if __name__ == "__main__":
	pass
```
