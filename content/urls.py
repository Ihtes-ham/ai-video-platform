from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, AnalyticsSummaryView

router = DefaultRouter()
router.register('videos', VideoViewSet, basename='video')

urlpatterns = router.urls + [
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
]