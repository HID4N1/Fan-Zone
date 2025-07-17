from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from datetime import timedelta

class Event(models.Model):
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_date = models.DateField(blank=True, null=True)
    fanzone = models.ForeignKey('FanZone', on_delete=models.CASCADE)
    qr_code_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Upcoming')
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)

    def update_status(self):
        now = timezone.now()
        if self.end_date and now.date() > self.end_date:
            self.status = 'Completed'
        else:
            event_start = timezone.make_aware(datetime.combine(self.date, self.start_time))
            event_end = event_start + timedelta(hours=24)

            if now < event_start:
                self.status = 'Upcoming'
            elif event_start <= now <= event_end:
                self.status = 'In Progress'
            else:
                self.status = 'Completed'
        self.save(update_fields=['status'])

    def __str__(self):
        return f"{self.name} - {self.date.strftime('%Y-%m-%d')}"

class FanZone(models.Model):
    name = models.CharField(max_length=100)
    adresse = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='fanzone_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class TransportType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=10, choices=[("tram", "Tram"), ("bus", "Bus")], unique=True)

    def __str__(self):
        return self.get_name_display()

class Line(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, help_text="Hex color code (e.g., #FF5733)")

    def __str__(self):
        return self.name

class Station(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    transport_type = models.ForeignKey(TransportType, on_delete=models.CASCADE)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name="stations")
    latitude = models.FloatField()
    longitude = models.FloatField()
    order = models.PositiveIntegerField(help_text="Order of the station in the line")

    class Meta:
        unique_together = ("line", "order")
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} ({self.line.name})"

class Route(models.Model):
    transport_type = models.CharField(max_length=10)
    start_station = models.ForeignKey(Station, related_name='start_routes', on_delete=models.CASCADE)
    end_station = models.ForeignKey(Station, related_name='end_routes', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.transport_type} route from {self.start_station.name} to {self.end_station.name} for {self.event.name}"
