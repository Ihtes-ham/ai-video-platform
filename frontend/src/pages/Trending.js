import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Trending() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('videos/trending/').then((res) => setVideos(res.data));
  }, []);

  return (
    <div style={{ padding: '24px 40px' }}>
      <h2 style={{ color: '#fff', marginBottom: 4 }}>🔥 Trending This Week</h2>
      <p style={{ color: '#999', marginBottom: 24, fontSize: 14 }}>
        Most watched and liked videos in the last 7 days
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {videos.map((video, index) => (
          <div
            key={video.id}
            onClick={() => navigate(`/video/${video.id}`)}
            style={{ background: '#1f1f1f', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{
              position: 'absolute', top: 8, left: 8, background: '#e50914',
              color: '#fff', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 4, zIndex: 1,
            }}>
              #{index + 1}
            </div>
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

      {videos.length === 0 && <p style={{ color: '#999' }}>No trending videos yet — watch or like some videos!</p>}
    </div>
  );
}

export default Trending;
