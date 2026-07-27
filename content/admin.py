from django.contrib import admin
from .models import Video, WatchHistory

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category','uploader', 'status', 'moderation_status', 'created_at']
    list_filter = ['category','moderation_status', 'status']

admin.site.register(WatchHistory)