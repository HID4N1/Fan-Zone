from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, FanZoneViewSet, EventViewSet, StationViewSet, RouteViewSet, PublicEventListView, PublicFanZoneListView, PublicEventDetailView, EventByQRCodeView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'fanzones', FanZoneViewSet)
router.register(r'events', EventViewSet)
router.register(r'stations', StationViewSet)
router.register(r'routes', RouteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('public-events/', PublicEventListView.as_view(), name='public-events'),
    path('public-events/<int:pk>/', PublicEventDetailView.as_view(), name='public-event-detail'),
    path('public-events/qr/<str:qr_code_id>/', EventByQRCodeView.as_view(), name='event-by-qr-code'),
    path('public-fanzones/', PublicFanZoneListView.as_view(), name='public-fanzones'),
]

# media url
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
