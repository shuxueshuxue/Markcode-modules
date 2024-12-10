
```python
import obsidian
import time

def split_and_open():
	split_tab()
	time.sleep(0.5)
	open_log()

def split_and_see_print():
	split_tab()
	time.sleep(0.5)
	open_print_log()

def split_and_see_output():
	split_tab()
	time.sleep(0.5)
	open_output_log()

def split_tab():
	obsidian.runjs("app.commands.executeCommandById('workspace:split-vertical');")

def open_log():
	# open the powershell log
	obsidian.open_file("Logs/psLog.md")

def open_print_log():
	obsidian.open_file("Logs/Print_temp.md")

def open_output_log():
	obsidian.open_file("Logs/run code log.md")

if __name__ == "__main__":
	split_and_see_output()
```

