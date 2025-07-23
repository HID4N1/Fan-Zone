from rest_framework import routers
from django.urls import path, include
from . import views
from .views import UserViewSet, FanZoneViewSet, EventViewSet, StationViewSet, RouteViewSet, PublicEventListView, PublicFanZoneListView, PublicEventDetailView, EventByQRCodeView, NearestStationView, WalkingRouteView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'fanzones', FanZoneViewSet)
router.register(r'events', EventViewSet)
router.register(r'stations', StationViewSet)
router.register(r'routes', RouteViewSet, basename='route')

urlpatterns = [
    path('', include(router.urls)),
    path('public-events/', PublicEventListView.as_view(), name='public-events'),
    path('public-events/<int:pk>/', PublicEventDetailView.as_view(), name='public-event-detail'),
    path('public-events/qr/<str:qr_code_id>/', EventByQRCodeView.as_view(), name='event-by-qr-code'),
    path('public-fanzones/', PublicFanZoneListView.as_view(), name='public-fanzones'),
    path('public-fanzones/<int:pk>/', views.PublicFanzoneDetailView.as_view(), name='public-fanzone-detail'),
    path('nearest-station/', NearestStationView.as_view(), name='nearest-station'),
    path('walking-route/', WalkingRouteView.as_view()),
    path('stations/by-name/', views.get_station_by_name, name='get_station_by_name'),
    

]

# media url
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
