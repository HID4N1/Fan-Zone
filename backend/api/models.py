from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField()
    start_time = models.DateTimeField()
    fanzone = models.ForeignKey('FanZone', on_delete=models.CASCADE)
    qr_code_id = models.CharField(max_length=100, unique=True)
    # image = models.ImageField(upload_to='event_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.date.strftime('%Y-%m-%d')}"

class FanZone(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField(blank=True)
    # image = models.ImageField(upload_to='fanzone_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Station(models.Model):
    name = models.CharField(max_length=100)
    transport_type = models.CharField(max_length=10, choices=[("tram", "Tram"), ("bus", "Bus")])
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.name} - {self.transport_type}"
    
class Route(models.Model):
    transport_type = models.CharField(max_length=10)
    start_station = models.ForeignKey(Station, related_name='start_routes', on_delete=models.CASCADE)
    end_station = models.ForeignKey(Station, related_name='end_routes', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.transport_type} route from {self.start_station.name} to {self.end_station.name} for {self.event.name}"