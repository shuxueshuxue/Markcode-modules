#LLM

```python
import openAIChat
import iohelper
import fileUtils
import claude_chat

note_path = os.environ.get('MD_FILE')
note_title = os.path.splitext(os.path.basename(note_path))[0]

selected = iohelper.get_selection()
selected_flag = bool(selected)

instruction = iohelper.input_prompt("Instruction").strip()
response = "error: response not updated"

def select_line():
	global selected, selected_flag
	js_code = """
let current_line =  app.workspace.activeEditor.editor.getCursor().line;
app.workspace.activeLeaf.view.sourceMode.cmEditor.setSelection(
	{ line: current_line, ch: 0 },
	{ line: current_line, ch: Infinity }
);
"""
	obsidian.runjs(js_code)
	selected = iohelper.get_selection()
	selected_flag = bool(selected)

model_flag = ""

if instruction.startswith("o1"):
	instruction = instruction[2:]
	model_flag = "o1-mini"

if instruction == "xx":
	print("Action cancelled.")
	exit()
elif instruction in ["h0", "h1", "h2", "h3", "h4", "h5"]:
	if not selected_flag:
		select_line()
	response = f"{'#'*int(instruction[1])} {selected.split('#')[-1].strip()}".strip()
else:
	reference = fileUtils.get_file_content(note_title+".md")
	
	# Get cursor position
	cursor_line = int(iohelper.get_cursor_line())
	cursor_column = int(iohelper.get_cursor_column())
	
	# Calculate cursor offset
	lines = reference.split('\n')
	cursor_offset = sum(len(line) + 1 for line in lines[:cursor_line]) + cursor_column
	
	if selected_flag:
	    # Calculate selection start offset
	    selection_start = cursor_offset - len(selected)
	    selection_end = cursor_offset
	    
	    # Insert markers around the selected text
	    reference = (
	        reference[:selection_start] +
	        "<selected>" +
	        reference[selection_start:selection_end] +
	        "</selected>" +
	        reference[selection_end:]
	    )
	else:
	    # Insert <cursor> marker at the cursor position
	    reference = reference[:cursor_offset] + "<cursor>" + reference[cursor_offset:]

	if not instruction:
	    instruction = "[Since it's obvious, no instruction given.]"
	
	prompt = f"Reference text:\n{reference}\n\n\n---\n\nSelected text:\n{selected if selected_flag else '[No selection]'}\n\n\n---\n\nInstruction:\n{instruction}\n\n\nNow you need to follow the instruction, and then give the edited version of the selected text or provide text to insert at the cursor position, which is indicated by <selected> or <cursor> marker in the reference text. You are a simple machine: only give the edited result without any extra explanation. The selection or cursor position will be replaced by your response, so do not oversize it! And NEVER wrap your response in a code block, which will corrupt the parsing system."
	if model_flag == "o1-mini":
		response = openAIChat.simple_chat(prompt, model="o1-mini")
	elif instruction:
		response = claude_chat.call_claude_api(prompt)
	else:
		# response = openAIChat.simple_chat(prompt, model="gpt-4o-mini")
		response = claude_chat.call_claude_api(prompt)
	
if selected_flag:
	iohelper.replace_selection(response)
else:
	iohelper.append_cursor(response)
```
