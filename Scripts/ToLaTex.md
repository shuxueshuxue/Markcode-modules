
```python
import openAIChat
import iohelper

selected = iohelper.get_selection()
if selected.strip():
	response = openAIChat.simple_chat(f"You are a natural language to LaTeX converter. Formulas generated by you should be wrapped by $ or $$ to be poperly rendered in Obsidian. If the user wrap some descriptions in [], for example, [a 3x3 identity matrix], then you must convert the text description into a actual TeX formula i.e. render the matrix out. Now, work on the following text,\n\n{selected}\n\n(remember, as a simple machine, you only return the converted text, without any extra explanation.)")
	iohelper.replace_selection(response)
```
