from django.core.management.base import BaseCommand
import os

class Command(BaseCommand):
    help = 'Check if ORS_API_KEY environment variable is set'

    def handle(self, *args, **kwargs):
        ors_api_key = os.getenv('ORS_API_KEY')
        if ors_api_key:
            self.stdout.write(self.style.SUCCESS('ORS_API_KEY is set.'))
            self.stdout.write(f'ORS_API_KEY: {ors_api_key}')
        else:
            self.stdout.write(self.style.ERROR('ORS_API_KEY is NOT set.'))
