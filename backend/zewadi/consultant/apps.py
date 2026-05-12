from django.apps import AppConfig


class ConsultantConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "consultant"

    def ready(self):
        import consultant.signals  # noqa: F401
