from django.core.management.base import BaseCommand
from api.models import Station, Line, TransfertStation

class Command(BaseCommand):
    help = 'Populate TransfertStation table with static data'

    transfer_stations_data = [
        {"line_1": "T1", "station_1": "Place Mohammed V", "line_2": "T4", "station_2": "Parc de la ligue arabe Terminus"},
        {"line_1": "T1", "station_1": "Okba Ibn Nafii", "line_2": "T4", "station_2": "Moulay Rachid"},
        {"line_1": "T1", "station_1": "Ibn Tachfine", "line_2": "T2", "station_2": "Mdakra"},
        {"line_1": "T1", "station_1": "Ali Yaata", "line_2": "T2", "station_2": "Carrières Centrales"},
        {"line_1": "T1", "station_1": "Abdelmoumen", "line_2": "T2", "station_2": "Anoual"},
        {"line_1": "T1", "station_1": "Laymoune", "line_2": "BW1", "station_2": "Omar El Khayam Terminus"},
        {"line_1": "T1", "station_1": "La Résistance", "line_2": "T3", "station_2": "Mohammed Smiha"},
        {"line_1": "T2", "station_1": "Derb Milan", "line_2": "T4", "station_2": "Hay Tissir"},
        {"line_1": "T2", "station_1": "Derb Sultan", "line_2": "T3", "station_2": "Derb Tolba"},
        {"line_1": "T2", "station_1": "Abdellah Ben Cherif", "line_2": "BW2", "station_2": "Aéropostale"},
        {"line_1": "T3", "station_1": "Idriss El Allam", "line_2": "T4", "station_2": "Hay El Falah"},
        {"line_1": "T3", "station_1": "Bd Mohammed VI", "line_2": "BW1", "station_2": "Al Qods"},
        {"line_1": "T3", "station_1": "Place de la Victoire", "line_2": "T4", "station_2": "Jaber Ibn Hayane"},
    ]

    def handle(self, *args, **options):
        for item in self.transfer_stations_data:
            try:
                line1 = Line.objects.get(name=item["line_1"])
                line2 = Line.objects.get(name=item["line_2"])
                station1 = Station.objects.get(name=item["station_1"], line=line1)
                station2 = Station.objects.get(name=item["station_2"], line=line2)
                # Check if transfer already exists
                exists = TransfertStation.objects.filter(station_1=station1, station_2=station2).exists()
                if not exists:
                    TransfertStation.objects.create(station_1=station1, station_2=station2)
                    self.stdout.write(self.style.SUCCESS(f"Added transfer: {station1} <-> {station2}"))
                else:
                    self.stdout.write(f"Transfer already exists: {station1} <-> {station2}")
            except Line.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Line not found: {item['line_1']} or {item['line_2']}"))
            except Station.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Station not found: {item['station_1']} or {item['station_2']}"))
