from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView

from .models import Video, WatchHistory, Comment, Like
from .serializers import VideoSerializer, WatchHistorySerializer, CommentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .embeddings import generate_embedding, cosine_similarity
from.analytics import get_analytics_summary
import numpy as np

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    def get_queryset(self):
        queryset = Video.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset
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

    @action(detail=False, methods=['get'])
    def for_you(self, request):
        user_history = WatchHistory.objects.filter(user=request.user).select_related('video')

        if not user_history.exists():
            return Response({"message": "No watch history yet — watch some videos first"})

        embeddings = [
            wh.video.embedding for wh in user_history
            if wh.video.embedding
        ]

        if not embeddings:
            return Response({"message": "No embeddings available yet"})

        avg_embedding = np.mean(embeddings, axis=0).tolist()

        watched_ids = user_history.values_list('video_id', flat=True)

        results = []
        for video in Video.objects.exclude(id__in=watched_ids).exclude(embedding__isnull=True):
            similarity = cosine_similarity(avg_embedding, video.embedding)
            results.append((video, similarity))

        results.sort(key=lambda x: x[1], reverse=True)
        top_videos = [v for v, score in results[:10]]

        serializer = self.get_serializer(top_videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        video = self.get_object()

        if request.method == 'GET':
            comments = video.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, video=video)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        like, created = Like.objects.get_or_create(video=video, user=request.user)

        if not created:
            like.delete()
            return Response({"liked": False, "likes_count": video.likes.count()})

        return Response({"liked": True, "likes_count": video.likes.count()})

class AnalyticsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(get_analytics_summary())

