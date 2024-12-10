#tool

```python
import pyperclip
from PIL import Image
import os

def rotate_image():
    # Get the file path from clipboard
    file_path = pyperclip.paste()

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        # Open the image
        with Image.open(file_path) as img:
            # Rotate the image
            rotated_img = img.rotate(90, expand=True)

            # Save the rotated image, overwriting the original
            rotated_img.save(file_path)

        print(f"Image rotated successfully: {file_path}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    rotate_image()
```
