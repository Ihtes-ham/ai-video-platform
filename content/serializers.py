from rest_framework import serializers
from .models import Video
from .embeddings import generate_embedding

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'uploader', 'duration', 'status', 'embedding', 'created_at']
        read_only_fields = ['uploader', 'status', 'created_at', 'embedding']

    def create(self, validated_data):
        text = f"{validated_data.get('title', '')} {validated_data.get('description', '')}"
        validated_data['embedding'] = generate_embedding(text)
        return super().create(validated_data)