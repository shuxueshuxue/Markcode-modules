
```python
import subprocess
import os

obs_vault = os.environ.get('OBS_VAULT')
default_log_path = os.path.join(obs_vault, "Logs", "psLog.md")

def run(ps_command, log_path=default_log_path):
	result = subprocess.run(["powershell", "-Command", ps_command], capture_output=True, text=True)
    
    # Write stdout and stderr to the log file
    with open(log_path, "w", encoding="utf-8") as log_file:
        log_file.write(f"`{ps_command}`\n")
        log_file.write('```powershell\n' + result.stdout.strip() + '\n```')
        log_file.write("\n")
        log_file.write('```powershell\n' + result.stderr.strip() + '\n```')
        log_file.write("\n")
    
    return result.stdout.strip()
```
