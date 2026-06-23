# scheduler/admin.py

from django.contrib import admin
from .models import ScheduledPass

admin.site.register(ScheduledPass)