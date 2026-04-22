import imghdr
from django.core.exceptions import ValidationError

ALLOWED_IMAGE_TYPES = {"jpeg", "png", "webp", "gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB


def validate_image_upload(file):
    if file.size > MAX_IMAGE_BYTES:
        raise ValidationError("Image must be 5 MB or smaller.")
    img_type = imghdr.what(file)
    if img_type not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f"Unsupported file type '{img_type}'. Allowed: jpeg, png, webp, gif."
        )
    file.seek(0)
