from django.contrib import admin
from .models import Video, WatchHistory

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploader', 'status', 'moderation_status', 'created_at']
    list_filter = ['moderation_status', 'status']

admin.site.register(WatchHistory)