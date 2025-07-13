from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, FanZone, Station, Route


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class FanZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanZone
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    fanzone = FanZoneSerializer(read_only=True)
    fanzone_id = serializers.PrimaryKeyRelatedField(
    queryset=FanZone.objects.all(), source='fanzone', write_only=True
    )
    class Meta:
        model = Event
        fields = '__all__'

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    start_station = StationSerializer(read_only=True)
    end_station = StationSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Route
        fields = '__all__'
