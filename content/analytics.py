import pandas as pd
from .models import WatchHistory


def get_analytics_summary():
    history = WatchHistory.objects.all().values('video__title', 'video_id', 'user__username', 'watch_duration')

    if not history:
        return {"message": "No watch history yet"}

    df = pd.DataFrame(list(history))

    most_watched = (
        df.groupby(['video_id', 'video__title'])
        .size()
        .reset_index(name='watch_count')
        .sort_values('watch_count', ascending=False)
        .to_dict(orient='records')
    )

    total_watch_time = (
        df.groupby(['video_id', 'video__title'])['watch_duration']
        .sum()
        .reset_index()
        .sort_values('watch_duration', ascending=False)
        .to_dict(orient='records')
    )

    per_user_activity = (
        df.groupby('user__username')
        .size()
        .reset_index(name='videos_watched')
        .to_dict(orient='records')
    )

    return {
        "most_watched_videos": most_watched,
        "total_watch_time_per_video": total_watch_time,
        "per_user_activity": per_user_activity,
    }