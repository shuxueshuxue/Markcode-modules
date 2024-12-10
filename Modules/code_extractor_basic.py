import re

def extract_and_save_code(markdown_file, output_file):
    with open(markdown_file, 'r', encoding='utf-8') as file:
        content = file.read()
    
    code_blocks = re.findall(r'```python\n(.*?)\n```', content, re.DOTALL)
    
    if not code_blocks:
        print("No Python code blocks found in the markdown file.")
        return None

    shebang_blocks = [block for block in code_blocks if block.lstrip().startswith('#!')]
    
    if shebang_blocks:
        full_code = '\n\n'.join(shebang_blocks)
    else:
        full_code = code_blocks[0]  # Only the first code block
    
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(full_code)
    # print(f"Python code extracted and saved to {output_file}")
    return full_code