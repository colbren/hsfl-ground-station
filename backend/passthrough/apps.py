from django.apps import AppConfig
import threading
import os


class PassthroughConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "passthrough"

    def ready(self):
        # Prevent Django autoreloader from starting two listeners
        if os.environ.get("RUN_MAIN") != "true":
            return

        from .udp_listener import start_listener

        thread = threading.Thread(
            target=start_listener,
            daemon=True,
        )

        thread.start()

        print("Started UDP listener thread")