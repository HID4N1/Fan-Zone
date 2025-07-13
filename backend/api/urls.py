from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, FanZoneViewSet, EventViewSet, StationViewSet, RouteViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'fanzones', FanZoneViewSet)
router.register(r'events', EventViewSet)
router.register(r'stations', StationViewSet)
router.register(r'routes', RouteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
