from django.apps import AppConfig
import threading
import os


class PassthroughConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "passthrough"

    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return

        from .service import start_passthrough

        threading.Thread(
            target=start_passthrough,
            daemon=True,
        ).start()