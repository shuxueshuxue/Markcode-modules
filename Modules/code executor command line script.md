---
nextFile: Notes/Markcode engine.md
---

## Run Code

```powershell
$env:PYTHONIOENCODING = "utf-8"
$vaultPath = "{{vault_path}}"
$filePath = "{{file_path:absolute}}"
$arguments = "`"$vaultPath`\Scripts`\executor.py`" --file_path `"$filePath`" --vault_path `"$vaultPath`""
$controlFilePath = "$env:USERPROFILE\python_control.txt"

$env:MD_FILE = $filePath
$env:OBS_VAULT = $vaultPath
$env:SCRIPT_MODE = "False"

# Ensure the control file exists and set initial status
if (-not (Test-Path -Path $controlFilePath)) {
    New-Item -Path $controlFilePath -ItemType File -Force
}
Set-Content -Path $controlFilePath -Value (Get-Date -Format "o")
$initialStatus = Get-Content -Path $controlFilePath

# Start the Python process
$process = Start-Process -FilePath "python" -ArgumentList $arguments -PassThru -NoNewWindow

while (-not $process.HasExited) {
    if (Test-Path -Path $controlFilePath) {
        $currentStatus = Get-Content -Path $controlFilePath
        if ($currentStatus -ne $initialStatus) {
            Write-Host "Status changed. Terminating process."
            taskkill /F /T /PID $process.Id
            break
        }
    } else {
        Write-Host "Control file deleted. Terminating process."
        taskkill /F /T /PID $process.Id
        break
    }
    Start-Sleep -Seconds 0.2
}

# if ($process.HasExited) {
    # Write-Host "Process completed."
# }
```

## Stop Running

```powershell
Set-Content -Path "$env:USERPROFILE\python_control.txt" -Value (Get-Date -Format "o")
```

## Run Script

```powershell
$vaultPath = "{{vault_path}}"
$filePath = "{{file_path:absolute}}"
$arguments = "`"$vaultPath`\Scripts`\executor.py`" --file_path `"$filePath`" --vault_path `"$vaultPath`""
$controlFilePath = "$env:USERPROFILE\python_control_script.txt"

$env:MD_FILE = $filePath
$env:OBS_VAULT = $vaultPath
$env:SCRIPT_MODE = "True"

# Ensure the control file exists and set initial status
if (-not (Test-Path -Path $controlFilePath)) {
    New-Item -Path $controlFilePath -ItemType File -Force
}
Set-Content -Path $controlFilePath -Value (Get-Date -Format "o")
$initialStatus = Get-Content -Path $controlFilePath

# Start the Python process
$process = Start-Process -FilePath "python" -ArgumentList $arguments -PassThru -NoNewWindow

while (-not $process.HasExited) {
    if (Test-Path -Path $controlFilePath) {
        $currentStatus = Get-Content -Path $controlFilePath
        if ($currentStatus -ne $initialStatus) {
            Write-Host "Status changed. Terminating process."
            taskkill /F /T /PID $process.Id
            break
        }
    } else {
        Write-Host "Control file deleted. Terminating process."
        taskkill /F /T /PID $process.Id
        break
    }
    Start-Sleep -Seconds 0.2
}

# if ($process.HasExited) {
    # Write-Host "Process completed."
# }
```

## Startup

```powershell
$vaultPath = "{{vault_path}}"
$env:OBS_VAULT = $vaultPath
$env:MD_FILE = "$vaultPath`\Logs`\startupLogging.md"
$env:vaultPath = $vaultPath

python "`"$vaultPath`\Scripts`\startup.py`""
```
