from django.core.management.base import BaseCommand

from passthrough.udp_listener import start_listener


class Command(BaseCommand):
    help = "Listen for telemetry packets"

    def handle(self, *args, **options):
        start_listener()