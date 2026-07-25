from django.db import models
from django.contrib.auth.models import User
from .storage import VideoStorage

class Video(models.Model):
    STATUS_CHOICES = (
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='videos/', storage=VideoStorage())
    embedding = models.JSONField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)  # ye same rahega, images ke liye default storage theek hai
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    duration = models.PositiveIntegerField(help_text="Duration in seconds", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watch_history')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='watch_history')
    watched_at = models.DateTimeField(auto_now_add=True)
    watch_duration = models.PositiveIntegerField(default=0, help_text="Seconds watched")

    def __str__(self):
        return f"{self.user.username} watched {self.video.title}"