from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route
from .serializers import UserSerializer, EventSerializer, FanZoneSerializer, StationSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class FanZoneViewSet(viewsets.ModelViewSet):
    queryset = FanZone.objects.all()
    serializer_class = FanZoneSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
