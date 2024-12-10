#tool

```python
import pyperclip
from PIL import Image
import os

def reverse_image_color():
    # Get the file path from clipboard
    file_path = pyperclip.paste()

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        # Open the image
        with Image.open(file_path) as img:
            # Convert image to RGB mode if it's not already
            if img.mode != 'RGB':
                img = img.convert('RGB')

            # Get image data as a list of pixels
            pixels = list(img.getdata())

            # Reverse the color of each pixel
            reversed_pixels = [(255-r, 255-g, 255-b) for (r, g, b) in pixels]

            # Create a new image with reversed colors
            reversed_img = Image.new(img.mode, img.size)
            reversed_img.putdata(reversed_pixels)

            # Save the reversed image, overwriting the original
            reversed_img.save(file_path)

        print(f"Image colors reversed successfully: {file_path}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    reverse_image_color()
```

```python
#!
import pyperclip
from PIL import Image
import os

def reverse_image_color():
    # Get the file path from clipboard
    file_path = pyperclip.paste()

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    try:
        # Open the image
        with Image.open(file_path) as img:
            # Convert image to RGBA mode if it's not already
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            # Get image data as a list of pixels
            pixels = list(img.getdata())

            # Reverse the color of each pixel, preserving alpha
            reversed_pixels = [(255-r, 255-g, 255-b, a) for (r, g, b, a) in pixels]

            # Create a new image with reversed colors
            reversed_img = Image.new(img.mode, img.size)
            reversed_img.putdata(reversed_pixels)

            # Save the reversed image, overwriting the original
            reversed_img.save(file_path)

        print(f"Image colors reversed successfully: {file_path}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    reverse_image_color()
```
