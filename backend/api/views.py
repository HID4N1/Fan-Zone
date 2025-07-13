from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route
from .serializers import UserSerializer, EventSerializer, FanZoneSerializer, StationSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class FanZoneViewSet(viewsets.ModelViewSet):
    queryset = FanZone.objects.all()
    serializer_class = FanZoneSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]



class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Event.objects.all()
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        now = timezone.now()
        for event in queryset:
            event.update_status()
        return queryset

    def create(self, request, *args, **kwargs):
        print("Received create event request with data:", request.data)
        response = super().create(request, *args, **kwargs)
        print("Create event response data:", response.data)
        return response

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
