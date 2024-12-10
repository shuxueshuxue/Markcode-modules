#github 

[Remote Repository Setup Manual (Git)](Remote%20Repository%20Setup%20Manual%20(Git).md)

```python
import powershell
import obsidian
import View_Log

obsidian.save_edit()
View_Log.split_tab()

commands = {
"set clash": '$env:http_proxy = "http://127.0.0.1:7890"',
"set clash": '$env:https_proxy = "http://127.0.0.1:7890"',
"Pull": 'git pull origin main --allow-unrelated-histories',
}

powershell.run(";".join(commands.values()))
View_Log.open_log()
```
