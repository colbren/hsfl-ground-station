from django.db import models
from satellites.models import Satellite

class TLE(models.Model):

    satellite = models.ForeignKey(
        Satellite,
        on_delete=models.CASCADE
    )

    line1 = models.CharField(max_length=100)

    line2 = models.CharField(max_length=100)

    epoch = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.satellite.name