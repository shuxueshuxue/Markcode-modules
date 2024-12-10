#vaultBuilding 

<!-- nr -->

```python
import requests
import os
import time

note_path = os.environ.get('MD_FILE')
obs_vault = os.environ.get('OBS_VAULT')

if note_path:
	note_title = os.path.splitext(os.path.basename(note_path))[0]
	note_directory = os.path.dirname(note_path)

def initialize(max_attempts=30, delay=0.5):
	"""
	Wait for the server to launch and become responsive.
	
	:param max_attempts: Maximum number of attempts to connect to the server
	:param delay: Delay in seconds between each attempt
	:return: True if server is responsive, False otherwise
	"""
	
	for attempt in range(max_attempts):
		try:
			response = runjs("return 200;")
			if response == 200:
				# print(f"Server is up and running after {attempt + 1} attempts.")
				return True
		except requests.RequestException:
			# print(f"Attempt {attempt + 1}/{max_attempts}: Server not responsive yet.")
			pass
		time.sleep(delay)
	
	print(f"Server did not become responsive after {max_attempts} attempts.")
	return False

```

```python
#xx

# The 'vault_path=obs_vault' is perhaps bad code. But isn't causing error anyway.
def runjs(js_code, vault_path=obs_vault, server_url='http://localhost:3300'):
	code_file = os.path.join(vault_path, 'code.js')
	
	# Write the JavaScript code to the file
	with open(code_file, 'w', encoding="utf-8") as f:
		f.write(js_code)
	
	# Send the request to the server
	response = requests.post(f'{server_url}/run')
	
	if response.status_code == 200:
		try:
			return response.json()
		except Exception:
			return ""
	else:
		raise Exception(f"Error: {response.status_code} - {response.text}")

```

```python

def runjs(js_code, server_url='http://localhost:3300'):
    # Send the JavaScript code directly in the request body
    response = requests.post(
        f'{server_url}/run',
        json={'code': js_code}
    )
    
    if response.status_code == 200:
        try:
            return response.json()
        except Exception:
            return ""
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")

def runjsf(file_path = "", as_script=False):
	# The as_script is useless. Only for compatibility with older version.
	script_mode = os.environ.get('SCRIPT_MODE')
	if not file_path:
		if script_mode == "True":
			script_file = runjs("return window.scriptFile;")
			file_path = script_file.replace(".md", ".js")
		else:
			file_path = note_path.replace(".md", ".js")
	with open(file_path, "r", encoding="utf-8") as f:
		script_content = f.read()
	
	return runjs(script_content)

# Be cautious this function will easily cause endless loop.
def executeCode():
	runjs('app.commands.executeCommandById("quickadd:choice:110a0b86-c6d4-4528-b4a5-9c0aeb7fc8d1");')

def scriptDone():
	runjs('window.scriptFile = "";')

def open_file(file_path):
    """
    Open a specific file in the current tab of the Obsidian vault.
    
    :param file_path: The path of the file to open, relative to the vault root
    :return: True if successful, False otherwise
    """
    js_code = f"""
const file = app.vault.getAbstractFileByPath("{file_path}");
if (file) {{
	const leaf = app.workspace.getLeaf();
	leaf.openFile(file);
}}
"""
    
    result = runjs(js_code)
    return result

def save_edit():
	runjs('app.commands.executeCommandById("editor:save-file")')

def refresh_view():
	js_code = """
const leaf = app.workspace.getLeaf();
setTimeout(async () => {
    await leaf.rebuildView();
}, 300);
"""
	runjs(js_code)

# Example usage
if __name__ == "__main__":
    js_code = """
return (function() {
    const activeFile = app.workspace.getActiveFile();
    if (activeFile) {
        return activeFile.path;
    } else {
        return "No active file";
    }
})();
    """
    
    result = runjs(js_code)
    print(result)
```
