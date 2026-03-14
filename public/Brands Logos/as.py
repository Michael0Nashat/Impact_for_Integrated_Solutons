from rembg import remove
from PIL import Image

input_path = "IMG-20260311-WA0022.jpg"
output_path = "12.png"

with Image.open(input_path) as img:
    output = remove(img)
    output.save(output_path)