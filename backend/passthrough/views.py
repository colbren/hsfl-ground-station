from rest_framework.views import APIView
from rest_framework.response import Response

from .packet_store import packet_buffer


class PacketView(APIView):
    def get(self, request):
        print(list(packet_buffer))
        return Response(list(packet_buffer))