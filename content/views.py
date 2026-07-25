from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView

from .models import Video, WatchHistory
from .serializers import VideoSerializer, WatchHistorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .embeddings import generate_embedding, cosine_similarity
from.analytics import get_analytics_summary

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=400)
        query_embedding = generate_embedding(query)
        results = []
        for video in Video.objects.exclude(embedding__isnull=True):
            similarity = cosine_similarity(query_embedding, video.embedding)
            results.append((video, similarity))
        results.sort(key=lambda x: x[1], reverse=True)
        top_videos = [video for video, score in results[:10]]
        serializer = self.get_serializer(top_videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def watch(self, request, pk=None):
        video = self.get_object()
        duration = request.data.get('watch_duration', 0)
        WatchHistory.objects.create(user=request.user, video=video, watch_duration=duration)
        return Response({"status": "watch recorded"})

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        video = self.get_object()
        if not video.embedding:
            return Response({"error": "This video has no embedding yet"}, status=400)

        results = []
        for other in Video.objects.exclude(id=video.id).exclude(embedding__isnull=True):
            similarity = cosine_similarity(video.embedding, other.embedding)
            results.append((other, similarity))

        results.sort(key=lambda x: x[1], reverse=True)
        top_videos = [v for v, score in results[:5]]
        serializer = self.get_serializer(top_videos, many=True)
        return Response(serializer.data)

class AnalyticsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(get_analytics_summary())

