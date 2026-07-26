import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import api from '../api';

function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const watchStart = useRef(Date.now());
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    api.get(`videos/${id}/`).then((res) => {
      if (isMounted) setVideo(res.data);
    });

    api
      .get(`videos/${id}/recommendations/`)
      .then((res) => {
        if (isMounted) setRecommendations(res.data);
      })
      .catch(() => {
        if (isMounted) setRecommendations([]);
      });

    api.get(`videos/${id}/comments/`).then((res) => setComments(res.data));

    watchStart.current = Date.now();

    return () => {
      isMounted = false;

      const watchedSeconds = Math.round(
        (Date.now() - watchStart.current) / 1000
      );

      if (watchedSeconds > 1) {
        api
          .post(`videos/${id}/watch/`, {
            watch_duration: watchedSeconds,
          })
          .catch(() => {});
      }
    };
  }, [id]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video?.hls_url) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.hls_url);
      hls.attachMedia(videoEl);

      return () => {
        hls.destroy();
      };
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = video.hls_url;
    }
  }, [video]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this video? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`videos/${id}/`);
      navigate('/');
    } catch (err) {
      alert('Failed to delete video.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await api.post(`videos/${id}/comments/`, { text: newComment });
    setComments([res.data, ...comments]);
    setNewComment('');
  };

  const handleLike = async () => {
    const res = await api.post(`videos/${id}/like/`);
    setLiked(res.data.liked);
    setLikesCount(res.data.likes_count);
  };

  if (!video) {
    return (
      <div
        style={{
          background: '#141414',
          minHeight: '100vh',
          color: '#fff',
          padding: 40,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#141414',
        padding: '24px 40px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#e50914',
            border: 'none',
            fontSize: 15,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ← Back to StreamAI
        </button>

        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            fontSize: 13,
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: 4,
          }}
        >
          Delete Video
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <video
          ref={videoRef}
          controls
          style={{
            width: '100%',
            borderRadius: 6,
            background: '#000',
          }}
        />

        <h2
          style={{
            color: '#fff',
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          {video.title}
        </h2>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              padding: '3px 10px',
              borderRadius: 12,
              background:
                video.moderation_status === 'flagged'
                  ? '#5c1a1a'
                  : '#1a4d2e',
              color:
                video.moderation_status === 'flagged'
                  ? '#ff6b6b'
                  : '#4ade80',
            }}
          >
            {video.moderation_status}
          </span>

          <span
            style={{
              fontSize: 12,
              padding: '3px 10px',
              borderRadius: 12,
              background: '#333',
              color: '#ccc',
            }}
          >
            {video.status}
          </span>
        </div>

        <p
          style={{
            color: '#ccc',
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {video.description}
        </p>

        <button
          onClick={handleLike}
          style={{
            marginTop: 16, background: liked ? '#e50914' : 'transparent',
            color: '#fff', border: '1px solid #e50914', borderRadius: 4,
            padding: '8px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}
        >
          {liked ? '♥ Liked' : '♡ Like'} ({likesCount})
        </button>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: '#fff', marginBottom: 12 }}>Comments</h3>
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{ flex: 1, padding: 10, background: '#333', border: 'none', borderRadius: 4, color: '#fff' }}
            />
            <button type="submit" style={{ padding: '10px 18px', background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Post
            </button>
          </form>
          {comments.map((c) => (
            <div key={c.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #333' }}>
              <strong style={{ color: '#fff', fontSize: 14 }}>{c.username}</strong>
              <p style={{ color: '#ccc', fontSize: 14, margin: '4px 0 0' }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div
          style={{
            maxWidth: 900,
            margin: '32px auto 0',
          }}
        >
          <h3
            style={{
              color: '#fff',
              marginBottom: 16,
            }}
          >
            More like this
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigate(`/video/${rec.id}`)}
                style={{
                  background: '#1f1f1f',
                  borderRadius: 6,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {rec.thumbnail ? (
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    style={{
                      width: '100%',
                      height: 110,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 110,
                      background: '#2a2a2a',
                    }}
                  />
                )}

                <div style={{ padding: 10 }}>
                  <strong
                    style={{
                      fontSize: 14,
                      color: '#fff',
                    }}
                  >
                    {rec.title}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoDetail;