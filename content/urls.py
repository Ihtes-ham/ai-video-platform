from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, AnalyticsSummaryView,PlaylistViewSet

router = DefaultRouter()
router.register('videos', VideoViewSet, basename='video')
router.register('playlists', PlaylistViewSet, basename='playlist')

urlpatterns = router.urls + [
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
]