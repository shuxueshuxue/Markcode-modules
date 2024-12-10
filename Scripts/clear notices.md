
```python
import obsidian

js_code = """
document.querySelectorAll("div.notice").forEach(el => el.remove())
"""

obsidian.runjs(js_code)
```
