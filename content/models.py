from django.db import models
from django.contrib.auth.models import User
from .storage import VideoStorage


class Video(models.Model):
    STATUS_CHOICES = (
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    )
    MODERATION_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('flagged', 'Flagged'),
    )

    moderation_status = models.CharField(max_length=20, choices=MODERATION_CHOICES, default='pending')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='videos/', storage=VideoStorage())
    embedding = models.JSONField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    duration = models.PositiveIntegerField(help_text="Duration in seconds", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def hls_url(self):
        if self.file:
            base_url = self.file.url
            streaming_url = base_url.replace('/upload/', '/upload/sp_auto/')
            return streaming_url + '.m3u8'
        return None
    def __str__(self):
        return self.title

class WatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watch_history')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='watch_history')
    watched_at = models.DateTimeField(auto_now_add=True)
    watch_duration = models.PositiveIntegerField(default=0, help_text="Seconds watched")

    def __str__(self):
        return f"{self.user.username} watched {self.video.title}"

class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.text[:30]}"


class Like(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.video.title}"
