def incrementHeaderLevel(markdown_text):
    result = []
    in_code_block = False
    for line in markdown_text.split('\n'):
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            result.append(line)
        elif not in_code_block and line.strip().startswith('# '):
            result.append('#' + line)
        else:
            result.append(line)
    return '\n'.join(result)
