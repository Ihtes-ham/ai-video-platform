from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows read access to anyone authenticated,but only the uploader can update or delete their own video.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.uploader == request.user