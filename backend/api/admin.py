from django.contrib import admin
from .models import Event, FanZone, Station, Route

from django.contrib import admin
from .models import Event, FanZone, Station, Route, TransportType, Line
from django import forms


class TimeStringField(forms.TimeField):
    def to_python(self, value):
        if value and not isinstance(value, str):
            return value.isoformat()
        return value

class EventAdminForm(forms.ModelForm):
    start_time = TimeStringField()

    class Meta:
        model = Event
        fields = '__all__'

    def clean_start_time(self):
        start_time = self.cleaned_data.get('start_time')
        print(f"clean_start_time called with value: {start_time}")  # Debug print
        if start_time and not isinstance(start_time, str):
            # Convert to string in HH:MM:SS format if it's a time object
            start_time = start_time.isoformat()
        return start_time

class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm

admin.site.register(Event, EventAdmin)
admin.site.register(FanZone)
admin.site.register(Station)
admin.site.register(TransportType)
admin.site.register(Line)
admin.site.register(Route)
