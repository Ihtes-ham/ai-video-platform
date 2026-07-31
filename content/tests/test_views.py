import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from content.models import Video


@pytest.mark.django_db
class TestVideoListAPI:
    def test_list_videos_requires_authentication(self):
        client = APIClient()
        response = client.get('/api/videos/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_videos_authenticated(self):
        user = User.objects.create_user(username='listuser', password='testpass123')
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get('/api/videos/')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestVideoPermissions:
    def test_owner_can_delete_own_video(self):
        owner = User.objects.create_user(username='owner1', password='testpass123')
        video = Video.objects.create(title='Owned Video', uploader=owner)

        client = APIClient()
        client.force_authenticate(user=owner)
        response = client.delete(f'/api/videos/{video.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Video.objects.filter(id=video.id).exists()

    def test_non_owner_cannot_delete_video(self):
        owner = User.objects.create_user(username='owner2', password='testpass123')
        other_user = User.objects.create_user(username='intruder', password='testpass123')
        video = Video.objects.create(title='Protected Video', uploader=owner)

        client = APIClient()
        client.force_authenticate(user=other_user)
        response = client.delete(f'/api/videos/{video.id}/')

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Video.objects.filter(id=video.id).exists()


@pytest.mark.django_db
class TestLikeEndpoint:
    def test_like_toggle(self):
        user = User.objects.create_user(username='likertest', password='testpass123')
        video = Video.objects.create(title='Video to Like', uploader=user)

        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(f'/api/videos/{video.id}/like/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['liked'] is True
        assert response.data['likes_count'] == 1

        response = client.post(f'/api/videos/{video.id}/like/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['liked'] is False
        assert response.data['likes_count'] == 0


@pytest.mark.django_db
class TestCommentEndpoint:
    def test_post_comment(self):
        user = User.objects.create_user(username='commentertest', password='testpass123')
        video = Video.objects.create(title='Video for Comments', uploader=user)

        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(f'/api/videos/{video.id}/comments/', {'text': 'Nice video!'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['text'] == 'Nice video!'

    def test_list_comments(self):
        user = User.objects.create_user(username='commentlisttest', password='testpass123')
        video = Video.objects.create(title='Video', uploader=user)

        client = APIClient()
        client.force_authenticate(user=user)
        client.post(f'/api/videos/{video.id}/comments/', {'text': 'First comment'})

        response = client.get(f'/api/videos/{video.id}/comments/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1