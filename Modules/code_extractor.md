
```python
import re
import os
import subprocess
import ctypes
import obsidian

def format_python_code(code):
    # Convert all indentation to spaces
    lines = code.split('\n')
    formatted_lines = []
    for line in lines:
        # Replace leading tabs with spaces (4 spaces per tab)
        stripped = line.lstrip('\t')
        indent = len(line) - len(stripped)
        formatted_line = '    ' * indent + stripped
        formatted_lines.append(formatted_line)
    
    return '\n'.join(formatted_lines)

def consistency_check():
    # Check consistency between .py, .hs, .cpp, and .md files
    code_files = [f for f in os.listdir() if f.endswith(('.py', '.hs', '.dll', ',js'))]
    md_files = [f[:-3] for f in os.listdir() if f.endswith('.md')]
    
    warnings = []
    for code_file in code_files:
        base_name = code_file.rsplit('.', 1)[0]  # Remove extension
        if base_name not in md_files:
            if code_file.endswith('.dll'):
                # Delete lonely .dll files
                os.remove(code_file)
                warnings.append(f"Deleted lonely .dll file: {code_file}")
            else:
                # warnings.append(f"Warning: {code_file} does not have a corresponding .md file.")
                warnings.append(f"Deleted lonely code file: {code_file}")
                os.remove(code_file)
    
    if warnings:
        print("\n".join(warnings))

def compile_cpp_to_dll(cpp_file):
    dll_file = cpp_file[:-4] + '.dll'
    compile_command = f'''g++ -shared -o "{dll_file}" "{cpp_file}"'''
    
    try:
        subprocess.run(compile_command, check=True, shell=True)
        return dll_file
    except subprocess.CalledProcessError:
        print(f"Failed to compile {cpp_file}")
        return None

def extract_and_save_code(markdown_file, output_file):
	script_mode = os.environ.get('SCRIPT_MODE')
	if script_mode == "True":
		script_file = obsidian.runjs("return window.scriptFile;")
		markdown_file = script_file
		output_file = script_file.replace(".md", ".py")

	with open(markdown_file, 'r', encoding='utf-8') as file:
		content = file.read()
	
	python_code = ""
	js_code = ""
	haskell_code = ""
	cpp_code = ""

	lines = content.split("\n")
	for (i, line) in enumerate(lines):
		if line.startswith("```"):
			lines[i] = line.split(" ")[0]
	content = "\n" + "\n".join(lines)

	# Extract all code blocks
	python_blocks = re.findall(r'\n```python\n(.*?)\n```', content, re.DOTALL)
	js_blocks = re.findall(r'\n```js\n(.*?)\n```', content, re.DOTALL)
	haskell_blocks = re.findall(r'\n```haskell\n(.*?)\n```', content, re.DOTALL)
	cpp_blocks = re.findall(r'\n```cpp\n(.*?)\n```', content, re.DOTALL)
	rust_blocks = re.findall(r'\n```rust\n(.*?)\n```', content, re.DOTALL)
	# This is for pushing the generated code to a local or remote project directory.
	push_blocks = re.findall(r'\n```push\n(.*?)\n```', content, re.DOTALL)
	push_code = push_blocks[0] if push_blocks else ""

	def muteWithMarker(blocks, mute_marker):
		result = []
		for (i, block) in enumerate(blocks):
			if not block.lstrip().startswith(mute_marker):
				result.append(block)
		blocks[:] = result

	muteWithMarker(python_blocks, "#xx")
	muteWithMarker(js_blocks, "//xx")
	muteWithMarker(haskell_blocks, "-- xx")
	muteWithMarker(cpp_blocks, "//xx")
	muteWithMarker(rust_blocks, "//xx")

	# Check for shebang blocks in all languages
	python_shebang_blocks = [block for block in python_blocks if block.lstrip().startswith('#!')]
	js_shebang_blocks = [block for block in js_blocks if block.lstrip().startswith('//!')]
	haskell_shebang_blocks = [block for block in haskell_blocks if block.lstrip().startswith('-- !')]
	cpp_shebang_blocks = [block for block in cpp_blocks if block.lstrip().startswith('//!')]
	rust_shebang_blocks = [block for block in rust_blocks if block.lstrip().startswith('//!')]
	
	# Determine if any shebang blocks exist
	shebang_existed = bool(python_shebang_blocks or js_shebang_blocks or haskell_shebang_blocks or cpp_shebang_blocks or rust_shebang_blocks)
	
	if shebang_existed:
		# If shebang blocks exist, use them for all languages
		python_code = '\n\n'.join(python_shebang_blocks) if python_shebang_blocks else ""
		js_code = '\n\n'.join(js_shebang_blocks) if js_shebang_blocks else ""
		haskell_code = '\n\n'.join(haskell_shebang_blocks) if haskell_shebang_blocks else ""
		cpp_code = '\n\n'.join(cpp_shebang_blocks) if cpp_shebang_blocks else ""
		rust_code = '\n\n'.join(rust_shebang_blocks) if rust_shebang_blocks else ""
	else:
		# If no shebang blocks, use the first block of each language
		python_code = '\n\n'.join(python_blocks) if python_blocks else ""
		js_code = '\n\n'.join(js_blocks) if js_blocks else ""
		haskell_code = '\n\n'.join(haskell_blocks) if haskell_blocks else ""
		cpp_code = '\n\n'.join(cpp_blocks) if cpp_blocks else ""
		rust_code = '\n\n'.join(rust_blocks) if rust_blocks else ""
	
	# Write Python code if it exists
	if python_code:
		python_code = format_python_code(python_code)
		with open(output_file, 'w', encoding='utf-8') as file:
			file.write(python_code)
	
	# Write JS code if it exists
	if js_code:
		with open(output_file.replace(".py", ".js"), 'w', encoding='utf-8') as file:
			file.write(js_code)

	# Write Haskell code if it exists
	if haskell_code:
		with open(output_file.replace(".py", ".hs"), 'w', encoding='utf-8') as file:
			file.write(haskell_code)
	
	# Handle C++ code
	if cpp_code:
		cpp_file = output_file.replace(".py", ".cpp")
		with open(cpp_file, 'w', encoding='utf-8') as file:
			file.write(cpp_code)
		
		# Compile C++ to DLL
		dll_file = compile_cpp_to_dll(cpp_file)
		
		# Remove the .cpp file
		os.remove(cpp_file)

	if push_code:
		push_path = push_code.strip()
		# I will later add the functionality of pushing to a remote server.
		if rust_code:
			try:
				with open(push_path, 'w', encoding='utf-8') as file:
					file.write(rust_code)
			except Exception as e:
				print(e)
			else:
				pass
				# print(f"Rust code successfully pushed to {push_path}")
		elif js_code:
			try:
				with open(push_path, 'w', encoding='utf-8') as file:
					file.write(js_code)
			except Exception as e:
				print(e)
			else:
				pass
		elif python_code:
			try:
				with open(push_path, 'w', encoding='utf-8') as file:
					file.write(python_code)
			except Exception as e:
				print(e)
			else:
				pass
	
	consistency_check()
	
	run_all = "<!-- nr -->" not in content
	run_python = "<!-- run python -->" in content or run_all
	run_haskell = "<!-- run haskell -->" in content or run_all
	
	return {"python": python_code, "js": js_code, "haskell": haskell_code, "cpp": cpp_code, "run_haskell": run_haskell, "run_python": run_python}

if __name__ == "__main__":
    pass

```

# Pragma/Maker

The `run haskell` marker is an outdated method. Useless now. Now use [testflow](testflow.md) to run extracted haskell code.
