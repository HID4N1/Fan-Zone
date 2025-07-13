from django.contrib import admin
from .models import Event, FanZone, Station, Route

admin.site.register(Event)
admin.site.register(FanZone)
admin.site.register(Station)
admin.site.register(Route)
