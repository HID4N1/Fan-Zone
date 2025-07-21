from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route, TransportType
from .serializers import UserSerializer, EventSerializer, FanZoneSerializer, StationSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import math
import requests
import os
from dotenv import load_dotenv
ORS_API_KEY = os.getenv('ORS_API_KEY')

load_dotenv()  

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


class NearestStationView(APIView):
    permission_classes = [AllowAny]

    ORS_URL = "https://api.openrouteservice.org/v2/directions/foot-walking"

    def get_walking_distance_time(self, start_lat, start_lon, end_lat, end_lon):
        # Calculate distance using Haversine formula
        R = 6371.0  # Earth radius in km
        lat1_rad = math.radians(start_lat)
        lon1_rad = math.radians(start_lon)
        lat2_rad = math.radians(end_lat)
        lon2_rad = math.radians(end_lon)
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_km = R * c
        # Assume average walking speed 5 km/h to estimate duration in minutes
        walking_speed_kmh = 5.0
        duration_min = (distance_km / walking_speed_kmh) * 60
        return distance_km, duration_min

    def get(self, request):
        try:
            user_lat = float(request.query_params.get("latitude"))
            user_lon = float(request.query_params.get("longitude"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing latitude/longitude parameters."}, status=status.HTTP_400_BAD_REQUEST)

        stations = Station.objects.select_related("line", "transport_type").all()
        transport_types = TransportType.objects.all()

        print(f"Total stations: {len(stations)}")
        print(f"Total transport types: {len(transport_types)}")

        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            lat1_rad = math.radians(lat1)
            lon1_rad = math.radians(lon1)
            lat2_rad = math.radians(lat2)
            lon2_rad = math.radians(lon2)
            dlat = lat2_rad - lat1_rad
            dlon = lon2_rad - lon1_rad
            a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            distance = R * c
            return distance

        nearest_stations = {}

        for transport_type in transport_types:
            # Find nearest 3 stations by Haversine distance
            stations_of_type = [station for station in stations if station.transport_type_id == transport_type.id]
            stations_of_type.sort(key=lambda s: haversine(user_lat, user_lon, s.latitude, s.longitude))
            nearest_three = stations_of_type[:3]

            print(f"Transport type: {transport_type.name}, stations to check: {len(nearest_three)}")

            nearest_station = None
            min_distance = float("inf")
            min_duration = None

            for station in nearest_three:
                print(f"Checking station: {station.name} ({station.line.name})")
                distance_km, duration_min = self.get_walking_distance_time(user_lat, user_lon, station.latitude, station.longitude)
                print(f"Calculated distance: {distance_km}, duration: {duration_min}")
                if distance_km is not None and distance_km < min_distance:
                    min_distance = distance_km
                    min_duration = duration_min
                    nearest_station = station

            if nearest_station:
                nearest_stations[transport_type.name] = {
                    "station_name": nearest_station.name,
                    "line_name": nearest_station.line.name,
                    "walking_time_minutes": round(min_duration, 2) if min_duration is not None else None,
                    "distance_km": round(min_distance, 3) if min_distance is not None else None,
                    "latitude": nearest_station.latitude,
                    "longitude": nearest_station.longitude,
                }

        if not nearest_stations:
            print("No nearest stations found.")

        return Response(nearest_stations, status=status.HTTP_200_OK)

import logging
import openrouteservice
import folium

logger = logging.getLogger(__name__)

class WalkingRouteView(APIView):
    def post(self, request):
        user_location = request.data.get('user_location')  # [lng, lat]
        station_location = request.data.get('station_location')  # [lng, lat]

        if not user_location or not station_location:
            logger.error("Missing coordinates in request data")
            return Response({"error": "Missing coordinates"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = openrouteservice.Client(key=ORS_API_KEY)
            coords = [user_location, station_location]
            route = client.directions(coordinates=coords, profile='foot-walking', format='geojson')


            m = folium.Map(location=list(reversed(user_location)), tiles="cartodbpositron", zoom_start=18)

            # Add blue dot marker for user location
            folium.CircleMarker(
            location=list(reversed(user_location)),
            radius=10,  
            color='white',
            weight=3,  
            fill=True,
            fill_color='#1E90FF',  
            fill_opacity=0.9,  
            ).add_to(m)

            # Add red dot marker for station location
            folium.CircleMarker(
                location=list(reversed(station_location)),
                radius=10,
                color='white',
                weight=3,
                fill=True,
                fill_color='#FF6347',  
                fill_opacity=0.9,  
            ).add_to(m)

            # Add route line
            route_coords = route['features'][0]['geometry']['coordinates']
            folium.PolyLine(locations=[list(reversed(coord)) for coord in route_coords], color="blue", weight=5).add_to(m)


            map_html = m._repr_html_()

            return Response({"map_html": map_html, "route": route})
        except Exception as e:
            import traceback
            logger.error(f"Error generating walking route: {e}\n{traceback.format_exc()}")
            return Response({"error": "Error generating walking route"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

