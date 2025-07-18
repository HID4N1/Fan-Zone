from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route
from .serializers import UserSerializer, EventSerializer, FanZoneSerializer, StationSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]




class FanZoneViewSet(viewsets.ModelViewSet):
    queryset = FanZone.objects.select_related('Nearest_Fanzone_station__line').all()
    serializer_class = FanZoneSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]


class PublicFanZoneListView(generics.ListAPIView):
    queryset = FanZone.objects.all()
    serializer_class = FanZoneSerializer
    permission_classes = [AllowAny]

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

class PublicEventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

class PublicEventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

class EventByQRCodeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, qr_code_id):
        print(f"Received QR code ID: {qr_code_id}")
        try:
            event = Event.objects.get(qr_code_id=qr_code_id)
            print(f"Found event: {event}")
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            print("Event not found for QR code ID.")
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.select_related('line').all()
    serializer_class = StationSerializer



class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
