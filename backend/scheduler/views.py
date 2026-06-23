from rest_framework import viewsets 
from .models import ScheduledPass 
from .serializers import ScheduledPassSerializer 

class ScheduledPassViewSet(viewsets.ModelViewSet): 
    queryset = ScheduledPass.objects.all() 
    serializer_class = ScheduledPassSerializer