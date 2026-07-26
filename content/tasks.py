import subprocess
import tempfile
import os
from celery import shared_task
from django.core.files import File
from .models import Video


@shared_task
def generate_thumbnail(video_id):
    try:
        video = Video.objects.get(id=video_id)
        video_url = video.file.url

        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_thumb:
            thumb_path = tmp_thumb.name

        # Extract a frame at 1 second into the video
        subprocess.run([
            'ffmpeg', '-y', '-i', video_url,
            '-ss', '00:00:01.000', '-vframes', '1', thumb_path
        ], check=True)

        with open(thumb_path, 'rb') as f:
            video.thumbnail.save(f"{video.id}_thumbnail.jpg", File(f), save=True)

        os.remove(thumb_path)
        video.status = 'ready'
        video.save()

    except Exception as e:
        video = Video.objects.get(id=video_id)
        video.status = 'failed'
        video.save()
        raise e