import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get(`playlists/${id}/`).then((res) => {
      setPlaylist(res.data);
      if (res.data.videos.length > 0) {
        Promise.all(res.data.videos.map((vid) => api.get(`videos/${vid}/`)))
          .then((responses) => setVideos(responses.map((r) => r.data)));
      }
    });
  }, [id]);

  if (!playlist) {
    return <div style={{ background: '#141414', minHeight: '100vh', color: '#fff', padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: '24px 40px' }}>
      <button
        onClick={() => navigate('/profile')}
        style={{ background: 'transparent', color: '#e50914', border: 'none', fontSize: 15, marginBottom: 20, cursor: 'pointer', fontWeight: 600 }}
      >
        ← Back to Profile
      </button>

      <h2 style={{ color: '#fff', marginBottom: 4 }}>{playlist.name}</h2>
      <p style={{ color: '#999', marginBottom: 24, fontSize: 14 }}>{videos.length} video{videos.length !== 1 ? 's' : ''}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/video/${video.id}`)}
            style={{ background: '#1f1f1f', borderRadius: 6, overflow: 'hidden', cursor: 'pointer' }}
          >
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: 140, background: '#2a2a2a' }} />
            )}
            <div style={{ padding: 12 }}>
              <strong style={{ fontSize: 15, color: '#fff' }}>{video.title}</strong>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && <p style={{ color: '#999' }}>This playlist is empty.</p>}
    </div>
  );
}

export default PlaylistDetail;
