from rest_framework import serializers
from .models import Video, WatchHistory,Comment, Like,Playlist
from .embeddings import generate_embedding
from .tasks import generate_thumbnail
from .moderation import check_content

class VideoSerializer(serializers.ModelSerializer):
    hls_url = serializers.ReadOnlyField()

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'hls_url', 'thumbnail', 'uploader', 'duration', 'status','category', 'moderation_status', 'embedding', 'created_at']
        read_only_fields = ['uploader', 'status', 'moderation_status', 'created_at', 'embedding']

    def create(self, validated_data):
        text = f"{validated_data.get('title', '')} {validated_data.get('description', '')}"
        validated_data['embedding'] = generate_embedding(text)
        validated_data['moderation_status'] = check_content(
            validated_data.get('title', ''),
            validated_data.get('description', '')
        )
        video = super().create(validated_data)
        generate_thumbnail.delay(video.id)
        return video


class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['id', 'user', 'video', 'watched_at', 'watch_duration']
        read_only_fields = ['user', 'watched_at']

from .models import Comment, Like

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'video', 'user', 'username', 'text', 'created_at']
        read_only_fields = ['user', 'video', 'created_at']

class PlaylistSerializer(serializers.ModelSerializer):
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'videos', 'video_count', 'created_at']
        read_only_fields = ['created_at']

    def get_video_count(self, obj):
        return obj.videos.count()
