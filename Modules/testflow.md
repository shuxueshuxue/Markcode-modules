# Languages

## Rust

```python
#!
import os
import powershell
import obsidian

note_path = os.environ.get('MD_FILE')
obs_vault = os.environ.get('OBS_VAULT')

def rustplay(path=r"D:\Codebase\rustplay", jump=True):
	commands = {
	"change directory": "cd " + path,
	"run code": "cargo r",
	}
	
	powershell.run(";".join(commands.values()))
	if jump:
		import View_Log
		View_Log.split_and_open()
```

## Haskell

[haskell global package management](haskell%20global%20package%20management.md)

```python
#!
def haskellplay(path="", jump=True):
	if not path:
		path = note_path.replace(".md", ".hs")
	commands = {
	"Set packages": '$env:GHC_PACKAGE_PATH = "C:/ghcup/ghc/9.4.8/lib/package.conf.d;C:/cabal/store/ghc-9.4.8/package.db"',
	"run code": "runhaskell " + '-i"' + os.path.join(obs_vault, "Modules") + f'" "{path}"',
	}
	
	powershell.run(";".join(commands.values()))
	if jump:
		import View_Log
		View_Log.split_and_open()
```
