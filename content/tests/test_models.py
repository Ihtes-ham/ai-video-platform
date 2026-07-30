import pytest
from django.contrib.auth.models import User
from content.models import Video, WatchHistory, Comment, Like


@pytest.mark.django_db
class TestVideoModel:
    def test_video_creation(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        video = Video.objects.create(
            title='Test Video',
            description='A test video',
            uploader=user,
        )
        assert video.title == 'Test Video'
        assert video.uploader == user
        assert video.status == 'processing'
        assert video.moderation_status == 'pending'

    def test_video_str_representation(self):
        user = User.objects.create_user(username='testuser2', password='testpass123')
        video = Video.objects.create(title='My Video', uploader=user)
        assert str(video) == 'My Video'

    def test_hls_url_without_file(self):
        user = User.objects.create_user(username='testuser3', password='testpass123')
        video = Video.objects.create(title='No File Video', uploader=user)
        assert video.hls_url is None


@pytest.mark.django_db
class TestWatchHistory:
    def test_watch_history_creation(self):
        user = User.objects.create_user(username='watcher', password='testpass123')
        video = Video.objects.create(title='Watched Video', uploader=user)
        watch = WatchHistory.objects.create(user=user, video=video, watch_duration=45)
        assert watch.watch_duration == 45
        assert watch.video == video


@pytest.mark.django_db
class TestComment:
    def test_comment_creation(self):
        user = User.objects.create_user(username='commenter', password='testpass123')
        video = Video.objects.create(title='Commented Video', uploader=user)
        comment = Comment.objects.create(video=video, user=user, text='Great video!')
        assert comment.text == 'Great video!'
        assert comment.video == video


@pytest.mark.django_db
class TestLike:
    def test_like_creation(self):
        user = User.objects.create_user(username='liker', password='testpass123')
        video = Video.objects.create(title='Liked Video', uploader=user)
        like = Like.objects.create(video=video, user=user)
        assert like.video == video
        assert like.user == user

    def test_duplicate_like_prevented(self):
        user = User.objects.create_user(username='liker2', password='testpass123')
        video = Video.objects.create(title='Video', uploader=user)
        Like.objects.create(video=video, user=user)
        with pytest.raises(Exception):
            Like.objects.create(video=video, user=user)