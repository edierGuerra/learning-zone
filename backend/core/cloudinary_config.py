import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url


# Upload an image
upload_result = cloudinary.uploader.upload(
    r"C:\Users\USUARIO\Documents\REPOSITORIOS\learning-zone\frontend\public\assets\courses\excel\content-excel-1.png"
)
print(upload_result["secure_url"])

# Optimize delivery by resizing and applying auto-format and auto-quality
optimize_url, _ = cloudinary_url(
    "excel-content-excel-1", fetch_format="auto", quality="auto"
)
print(optimize_url)

# Transform the image: auto-crop to square aspect_ratio
auto_crop_url, _ = cloudinary_url(
    "excel-content-excel-1", width=500, height=500, crop="auto", gravity="auto"
)
print(auto_crop_url)
