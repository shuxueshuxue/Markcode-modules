import os
import re

def get_file_content(filename="", search_folders=None):
    if not search_folders:
        search_folders = []
    search_folders += ["../Modules", "../Scripts", "../Others/Template", "../Notes", "../Blogs"]

    if not filename:
        note_path = os.environ.get('MD_FILE')
        note_title = os.path.splitext(os.path.basename(note_path))[0]
        filename = note_title+".md"
    
    # First, try to open the file in the current directory
    try:
        with open(filename, 'r', encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        pass  # File not found in current directory, continue to search in other folders

    # Search in the provided folders
    for folder in search_folders:
        if not os.path.exists(folder):
            continue  # Silently ignore non-existent folders
        
        if folder.endswith("Blogs") or folder.endswith("Notes"):
            # Recursively search through all subfolders of the Blog directory
            for root, dirs, files in os.walk(folder):
                file_path = os.path.join(root, filename)
                try:
                    with open(file_path, 'r', encoding="utf-8") as file:
                        return file.read()
                except FileNotFoundError:
                    continue  # File not found in this subfolder, continue searching
                except IOError:
                    return f"Error: Unable to read file '{file_path}'."
        else:
            # For other folders, search only in the top level
            try:
                file_path = os.path.join(folder, filename)
                with open(file_path, 'r', encoding="utf-8") as file:
                    return file.read()
            except FileNotFoundError:
                continue  # File not found in this folder, try the next one
            except IOError:
                return f"Error: Unable to read file '{file_path}'."
    
    # If the file is not found in any of the folders
    return f"Error: File '{filename}' not found in the searched directories."

def replace_links_with_content(text, search_folders=[]):
    def replace_match(match):
        filename = match.group(1)
        content = get_file_content(f"{filename}.md", search_folders)
        return content if not content.startswith("Error:") else match.group(0)

    pattern = r'\[(.*?)\]\(.*?\.md\)'
    return re.sub(pattern, replace_match, text)

if __name__ == "__main__":
    # import iohelper
    # iohelper.printh(get_file_content("Number growing.md"))
    pass