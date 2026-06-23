from django.db import models

class Satellite(models.Model):
    name = models.CharField(max_length=100)
    norad_id = models.IntegerField(unique=True)

    uplink_freq = models.FloatField(null=True, blank=True)
    downlink_freq = models.FloatField(null=True, blank=True)

    mode = models.CharField(max_length=100, blank=True)
    owner = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name