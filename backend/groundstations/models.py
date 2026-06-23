# groundstations/models.py

from django.db import models

class GroundStation(models.Model):
    STATUS_CHOICES = [
        ("Online", "Online"),
        ("Offline", "Offline"),
        ("Maintenance", "Maintenance"),
    ]

    name = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Online"
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitudeM = models.FloatField(default=0)

    def __str__(self):
        return self.name