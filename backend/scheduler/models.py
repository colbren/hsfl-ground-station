# scheduler/models.py

from django.db import models
from satellites.models import Satellite
from groundstations.models import GroundStation


class ScheduledPass(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Running", "Running"),
        ("Complete", "Complete"),
        ("Failed", "Failed"),
    ]

    satellite = models.ForeignKey(
        Satellite,
        on_delete=models.CASCADE
    )

    ground_station = models.ForeignKey(
        GroundStation,
        on_delete=models.CASCADE
    )

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    priority = models.IntegerField(default=1)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    def __str__(self):
        return f"{self.satellite.name} @ {self.ground_station.name}"