from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Video
from .serializers import VideoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .embeddings import generate_embedding, cosine_similarity


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