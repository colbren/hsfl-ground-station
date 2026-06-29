from django.db import models

class Satellite(models.Model):
    name = models.CharField(max_length=100)
    norad_id = models.PositiveIntegerField(unique=True)

    tle_line1 = models.TextField(blank=True, null=True)
    tle_line2 = models.TextField(blank=True, null=True)
    tle_updated = models.DateTimeField(blank=True, null=True)

    enabled = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name