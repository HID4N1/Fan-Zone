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

# Removed duplicate StationSerializer without line_name


class RouteSerializer(serializers.ModelSerializer):
    start_station = StationSerializer(read_only=True)
    end_station = StationSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Route
        fields = '__all__'
