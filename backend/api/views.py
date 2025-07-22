import logging
from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route, TransportType
from .serializers import UserSerializer, EventSerializer, FanZoneSerializer, StationSerializer, RouteSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, filters
import math
import os
from dotenv import load_dotenv
from rest_framework.decorators import action
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

    def get(self, request, *args, **kwargs):
        event_id = kwargs.get('pk')
        try:
            event = Event.objects.get(id=event_id)
            serializer = self.get_serializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            logging.error(f"Event with ID {event_id} does not exist.")
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logging.error(f"Error retrieving event details: {e}")
            return Response({"error": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'line__name']

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def full_route(self, request, pk=None):
        route = self.get_object()
        serializer = self.get_serializer(route)
        return Response(serializer.data)

    

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        full_route = self.get_full_route(instance)
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['full_route'] = full_route
        return Response(data)

    def get_full_route(self, route):
        """
        Compute the full route between start_station and end_station,
        including stations with their lines, handling combinations of lines
        of same or different transport types.
        """
        logger = logging.getLogger(__name__)
        from api.models import TransfertStation

        try:
            start_station = route.start_station
            end_station = route.end_station

            if not start_station or not end_station:
                logger.error("Start station or end station is None")
                return []

            logger.info(f"Start station: {start_station}, End station: {end_station}")

            # If start and end stations are on the same line and transport type
            if (start_station.line_id == end_station.line_id and
                start_station.transport_type_id == end_station.transport_type_id):
                stations = list(start_station.line.stations.filter(
                    order__gte=min(start_station.order, end_station.order),
                    order__lte=max(start_station.order, end_station.order)
                ).order_by('order'))
                if start_station.order > end_station.order:
                    stations.reverse()
                logger.info(f"Direct route stations count: {len(stations)}")
                return [self.serialize_station(s) for s in stations]

            # If different lines or transport types, find a combined route using TransfertStation model
            from django.db import models
            transfer_stations = TransfertStation.objects.filter(
                models.Q(station_1__line=start_station.line, station_2__line=end_station.line) |
                models.Q(station_2__line=start_station.line, station_1__line=end_station.line)
            )

            logger.info(f"Found {transfer_stations.count()} transfer stations")

            if not transfer_stations.exists():
                # No transfer station found, return start and end stations only
                logger.warning("No transfer stations found between lines")
                return [self.serialize_station(start_station), self.serialize_station(end_station)]


            # Choose the first transfer station for route
            transfer = transfer_stations.first()
            logger.info(f"Using transfer station: {transfer}")

            # Determine which station in transfer corresponds to start line and end line
            if transfer.station_1.line == start_station.line:
                transfer_start = transfer.station_1
                transfer_end = transfer.station_2
            else:
                transfer_start = transfer.station_2
                transfer_end = transfer.station_1

            logger.info(f"Transfer start: {transfer_start}, Transfer end: {transfer_end}")

            # Get route from start_station to transfer_start
            route_part1 = list(start_station.line.stations.filter(
                order__gte=min(start_station.order, transfer_start.order),
                order__lte=max(start_station.order, transfer_start.order)
            ).order_by('order'))
            if start_station.order > transfer_start.order:
                route_part1.reverse()

            # Get route from transfer_end to end_station
            route_part2 = list(end_station.line.stations.filter(
                order__gte=min(transfer_end.order, end_station.order),
                order__lte=max(transfer_end.order, end_station.order)
            ).order_by('order'))
            if transfer_end.order > end_station.order:
                route_part2.reverse()

            # Combine routes, avoid duplicate transfer station
            full_route = [self.serialize_station(s) for s in route_part1]
            full_route.extend([self.serialize_station(s) for s in route_part2])

            logger.info(f"Full route stations count: {len(full_route)}")

            return full_route
        except Exception as e:
            logger.error(f"Error in get_full_route: {e}")
            raise

    def serialize_station(self, station):
        return {
            'id': station.id,
            'name': station.name,
            'line': {
                'id': station.line.id,
                'name': station.line.name,
                'color': station.line.color,
            },
            'transport_type': station.transport_type.name,
            'order': station.order,
            'latitude': station.latitude,
            'longitude': station.longitude,
        }

    def create(self, request, *args, **kwargs):
        """
        Override create to dynamically create a route based on userStation and destinationStation
        """
        import logging
        logger = logging.getLogger(__name__)
        data = request.data
        user_station_id = data.get('user_station_id')
        destination_station_id = data.get('destination_station_id')
        event_id = data.get('event_id')
        user_station_name = data.get('user_station_name')  # New field for station name

        logger.info(f"Create route request data: user_station_id={user_station_id}, destination_station_id={destination_station_id}, event_id={event_id}, user_station_name={user_station_name}")

        if not destination_station_id or not event_id:
            logger.error("Missing required fields in create route request")
            return Response({"error": "Missing required fields."}, status=400)

        try:
            from .models import Station, Event, Route

            # Fetch user station by ID or name
            if user_station_id:
                user_station = Station.objects.get(id=user_station_id)
            elif user_station_name:
                user_station = Station.objects.filter(name=user_station_name).first()
                if not user_station:
                    logger.error("User station not found by name.")
                    return Response({"error": "User station not found by name."}, status=404)
            else:
                logger.error("User station information missing.")
                return Response({"error": "User station information missing."}, status=400)

            destination_station = Station.objects.get(id=destination_station_id)
            event = Event.objects.get(id=event_id)

            logger.info(f"Fetched user_station: {user_station}, destination_station: {destination_station}, event: {event}")

            # Create a temporary Route object (not saved to DB)
            temp_route = Route(
                start_station=user_station,
                end_station=destination_station,
                event=event,
                transport_type=user_station.transport_type.name  # or other logic
            )

            full_route = self.get_full_route(temp_route)
            serializer = self.get_serializer(temp_route)
            data = serializer.data
            data['full_route'] = full_route
            return Response(data)
        except Station.DoesNotExist:
            logger.error("Station not found.")
            return Response({"error": "Station not found."}, status=404)
        except Event.DoesNotExist:
            logger.error("Event not found.")
            return Response({"error": "Event not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in create route: {e}")
            return Response({"error": str(e)}, status=500)

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


from rest_framework.decorators import api_view
@api_view(['GET'])
def get_station_by_name(request):
    name = request.query_params.get("name")
    if not name:
        logging.error("Station name parameter is missing.")
        return Response({"error": "Missing station name"}, status=400)

    try:
        station = Station.objects.filter(name__iexact=name).first()
        if station:
            return Response({
                "id": station.id,
                "name": station.name,
                "line": station.line.name,
                "transport_type": station.transport_type.name
            })
        logging.warning(f"Station not found for name: {name}")
        return Response({"error": "Station not found"}, status=404)
    except Exception as e:
        logging.error(f"Error fetching station by name: {e}")
        return Response({"error": "Internal server error"}, status=500)