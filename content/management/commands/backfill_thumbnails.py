from django.core.management.base import BaseCommand
from django.db.models import Q
from content.models import Video
from content.tasks import generate_thumbnail


class Command(BaseCommand):
    help = 'Trigger thumbnail generation for videos that are missing one'

    def handle(self, *args, **kwargs):
        videos = Video.objects.filter(Q(thumbnail='') | Q(thumbnail__isnull=True))
        count = videos.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('No videos missing thumbnails.'))
            return

        for video in videos:
            generate_thumbnail.delay(video.id)
            self.stdout.write(f'Queued thumbnail generation for: {video.title} (id={video.id})')

        self.stdout.write(self.style.SUCCESS(f'Queued {count} videos for thumbnail generation.'))