from django.apps import AppConfig


class ConsultantConfig(AppConfig):
    name = 'consultant'

    def ready(self):
        import consultant.signals  # noqa: F401
