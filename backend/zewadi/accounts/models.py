import uuid
import uuid as _uuid
from datetime import timedelta
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from supperadmin.models import Role


ROLE_CHOICES = (
    ("ADMIN", "Admin"),
    ("INTERNAL_STAFF", "Internal Staff"),
    ("CONSULTANT", "Consultant"),
    ("COMMUNITY_USER", "Community User"),
)

GENDER_CHOICES = (
    ("MALE", "Male"),
    ("FEMALE", "Female"),  # ✅ fixed spelling
    ("OTHER", "Other"),
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not password:
            raise ValueError("Password is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # ✅ fixed role assignment
        extra_fields.setdefault("role", "ADMIN")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractUser):
    username = None

    user_id = models.CharField(max_length=10, unique=True, editable=False)
    user_name = models.CharField(max_length=20)

    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)

    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to="profile_photos/", null=True, blank=True)

    # ✅ fixed default
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="COMMUNITY_USER")
    role_obj = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "user_name"]

    objects = UserManager()

    def save(self, *args, **kwargs):
        if not self.user_id:
            with transaction.atomic():
                last = (
                    User.objects.select_for_update()
                    .filter(user_id__startswith="Z")
                    .order_by("-user_id")
                    .first()
                )
                try:
                    num = int(last.user_id[1:]) + 1 if last else 1
                except (ValueError, TypeError):
                    raise ValueError(f"Cannot parse user_id '{last.user_id}' — suffix must be numeric.")
                self.user_id = f"Z{num:04d}"
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"


class OTP(models.Model):
    PURPOSE_EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PURPOSE_PASSWORD_RESET = "PASSWORD_RESET"
    PURPOSE_CHOICES = [
        (PURPOSE_EMAIL_VERIFICATION, "Email Verification"),
        (PURPOSE_PASSWORD_RESET, "Password Reset"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    reset_token = models.UUIDField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "purpose", "is_used"])]

    @classmethod
    def generate(cls, user, purpose):
        import random
        cls.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
        code = f"{random.randint(100000, 999999)}"
        return cls.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

    @classmethod
    def verify(cls, user, code, purpose):
        try:
            otp = cls.objects.get(
                user=user,
                code=code,
                purpose=purpose,
                is_used=False,
                expires_at__gt=timezone.now(),
            )
        except cls.DoesNotExist:
            return None
        otp.is_used = True
        if purpose == cls.PURPOSE_PASSWORD_RESET:
            otp.reset_token = _uuid.uuid4()
        otp.save(update_fields=["is_used", "reset_token"])
        return otp
