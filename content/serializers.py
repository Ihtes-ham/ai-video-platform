from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'uploader', 'duration', 'status', 'created_at']
        read_only_fields = ['uploader', 'status', 'created_at']