from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class StationSerializer(serializers.ModelSerializer):
    line_name = serializers.SerializerMethodField()

    class Meta:
        model = Station
        fields = ['id', 'name', 'line_name']

    def get_line_name(self, obj):
        if obj.line and obj.line.name:
            return obj.line.name
        return ''

class FanZoneSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    Nearest_Fanzone_station = StationSerializer(read_only=True)
    Nearest_Fanzone_station_id = serializers.PrimaryKeyRelatedField(
        queryset=Station.objects.all(),
        source='Nearest_Fanzone_station',
        write_only=True,
        required=False,
        allow_null=True,
    )
    class Meta:
        model = FanZone
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    fanzone = FanZoneSerializer(read_only=True)
    fanzone_id = serializers.PrimaryKeyRelatedField(
        queryset=FanZone.objects.all(), source='fanzone', write_only=True
    )
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Event
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    start_station = StationSerializer(read_only=True)
    end_station = StationSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    full_route = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = ['id', 'transport_type', 'start_station', 'end_station', 'event', 'full_route']

    def get_full_route(self, obj):
        """
        Returns the full route as a list of stations with their line info.
        Handles routes that may combine two lines of the same or different transport types.
        """
        # Import here to avoid circular imports
        from .models import Station

        start_station = obj.start_station
        end_station = obj.end_station

        # If start or end station is missing, return empty list
        if not start_station or not end_station:
            return []

        # If start and end station are on the same line and transport type
        if (start_station.line_id == end_station.line_id and
            start_station.transport_type_id == end_station.transport_type_id):
            # Get stations on the same line between start and end order
            stations = Station.objects.filter(
                line_id=start_station.line_id,
                order__gte=min(start_station.order, end_station.order),
                order__lte=max(start_station.order, end_station.order),
                transport_type_id=start_station.transport_type_id
            ).order_by('order')
            return [
                {
                    'id': station.id,
                    'name': station.name,
                    'line': station.line.name,
                    'transport_type': station.transport_type.name,
                    'order': station.order,
                }
                for station in stations
            ]

        # If start and end station are on different lines or transport types
        # For simplicity, return start and end stations only
        # TODO: Implement logic to find transfer stations and full combined route
        return [
            {
                'id': start_station.id,
                'name': start_station.name,
                'line': start_station.line.name,
                'transport_type': start_station.transport_type.name,
                'order': start_station.order,
            },
            {
                'id': end_station.id,
                'name': end_station.name,
                'line': end_station.line.name,
                'transport_type': end_station.transport_type.name,
                'order': end_station.order,
            }
        ]
