import json
import os
from django.core.management.base import BaseCommand
from api.models import Station, TransportType, Line
from django.db import transaction

class Command(BaseCommand):
    help = 'Populate the Station database from station_data.json'

    def handle(self, *args, **options):
        # Path to the JSON data file
        json_path = os.path.join(os.path.dirname(__file__), '../../data/station_data.json')

        # Load JSON data
        with open(json_path, 'r', encoding='utf-8') as f:
            station_data = json.load(f)

        self.stdout.write(f"Loaded {len(station_data)} stations from JSON.")

        with transaction.atomic():
            for entry in station_data:
                transport_type_name = entry['transport_type'].lower()
                line_name = entry['line_name']
                station_name = entry['station_name']
                latitude = entry['latitude']
                longitude = entry['longitude']
                order = entry['order']

                # Get or create TransportType
                transport_type_obj, _ = TransportType.objects.get_or_create(
                    name=transport_type_name
                )

                # Get or create Line
                line_obj, _ = Line.objects.get_or_create(
                    name=line_name
                )

                # Create or update Station
                station_obj, created = Station.objects.update_or_create(
                    line=line_obj,
                    order=order,
                    defaults={
                        'name': station_name,
                        'transport_type': transport_type_obj,
                        'latitude': latitude,
                        'longitude': longitude,
                    }
                )

                if created:
                    self.stdout.write(f"Created station: {station_name} on line {line_name}")
                else:
                    self.stdout.write(f"Updated station: {station_name} on line {line_name}")

        self.stdout.write(self.style.SUCCESS('Successfully populated stations from JSON.'))
