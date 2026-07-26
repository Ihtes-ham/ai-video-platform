from rest_framework import serializers
from .models import Video, WatchHistory
from .embeddings import generate_embedding
from .tasks import generate_thumbnail


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'uploader', 'duration', 'status', 'embedding', 'created_at']
        read_only_fields = ['uploader', 'status', 'created_at', 'embedding']

    def create(self, validated_data):
        text = f"{validated_data.get('title', '')} {validated_data.get('description', '')}"
        validated_data['embedding'] = generate_embedding(text)
        video = super().create(validated_data)
        generate_thumbnail.delay(video.id)
        return video


class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['id', 'user', 'video', 'watched_at', 'watch_duration']
        read_only_fields = ['user', 'watched_at']