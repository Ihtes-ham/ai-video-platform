from cloudinary_storage.storage import MediaCloudinaryStorage

class VideoStorage(MediaCloudinaryStorage):
    RESOURCE_TYPE = 'video'