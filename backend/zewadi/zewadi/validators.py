from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError

ALLOWED_IMAGE_TYPES = {"jpeg", "png", "webp", "gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB


def validate_image_upload(file):
    if file.size > MAX_IMAGE_BYTES:
        raise ValidationError("Image must be 5 MB or smaller.")

    start_position = file.tell() if hasattr(file, "tell") else 0

    try:
        file.seek(0)
        with Image.open(file) as image:
            img_type = image.format.lower()
    except (UnidentifiedImageError, OSError, AttributeError):
        img_type = None
    finally:
        file.seek(start_position)

    if img_type not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f"Unsupported file type '{img_type}'. Allowed: jpeg, png, webp, gif."
        )
