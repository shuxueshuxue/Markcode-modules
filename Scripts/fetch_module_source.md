```python
import os
import importlib
import inspect
import sys

def is_installed_module(module_name):
    try:
        importlib.import_module(module_name)
        return True
    except ImportError:
        return False

def fetch_source(module_name):
    try:
        module = importlib.import_module(module_name)
        source_file = inspect.getfile(module)
        with open(source_file, 'r') as file:
            source_code = file.read()
        return source_code
    except Exception as e:
        return str(e)

def main(module_name, output_file):
    if not is_installed_module(module_name):
        print(f"Module '{module_name}' is not an installed Python module.")
        sys.exit(1)

    source_code = fetch_source(module_name)
    with open(output_file, 'w') as file:
        file.write(f"```python\n{source_code}\n```")
    print(f"Source code of {module_name} has been written to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python fetch_module_source.py <module_name> <output_file>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
```