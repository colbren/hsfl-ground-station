import os
import threading
from django.apps import AppConfig


class PassthroughConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "passthrough"

    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return

        # from .downlink_service import start_telemetry_pipeline
        from .uplink_service import start_command_pipeline

        # threading.Thread(target=start_telemetry_pipeline, daemon=True).start()
        threading.Thread(target=start_command_pipeline, daemon=True).start()

        print("Gateway running: telemetry + commands")