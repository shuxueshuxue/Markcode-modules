
```python
import iohelper
import obsidian
import os
import requests
import shutil
from urllib.parse import unquote, urlparse

def is_url(path):
    return path.startswith(('http://', 'https://', 'file:///'))

def get_filename_from_path(path):
    return os.path.basename(unquote(urlparse(path).path))

def download_file(url, destination):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(destination, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
    
    # Post-processing for specific websites
    if 'arxiv.org' in url and not destination.endswith('.pdf'):
        os.rename(destination, f"{destination}.pdf")
        destination = f"{destination}.pdf"
    return destination

def copy_local_file(source, destination):
    shutil.copy2(source, destination)

def process_link(link):
    if not obsidian.note_directory:
        print("Error: Unable to determine the current note directory.")
        return

    filename = get_filename_from_path(link)
    destination = os.path.join(obsidian.note_directory, filename)

    try:
        if is_url(link):
            if link.startswith('file:///'):
                source_path = unquote(urlparse(link).path)[1:]  # Remove leading slash
                copy_local_file(source_path, destination)
            else:
                download_file(link, destination)
        else:
            copy_local_file(link, destination)
        
        print(f"Successfully copied/downloaded '{filename}' to {obsidian.note_directory}")
    except Exception as e:
        print(f"Error processing '{link}': {str(e)}")

if __name__ == "__main__":
    link = iohelper.input_prompt("Source File Link").strip()
    if link:
        process_link(link)
    else:
        print("No link selected.")
```
