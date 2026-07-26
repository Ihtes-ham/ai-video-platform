import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profile() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('videos/').then((res) => setVideos(res.data));
  }, []);

  return (
    <div style={{ padding: '24px 40px' }}>
      <h2 style={{ color: '#fff', marginBottom: 4 }}>My Videos</h2>
      <p style={{ color: '#999', marginBottom: 24, fontSize: 14 }}>
        {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
      </p>

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
              <div style={{ width: '100%', height: 140, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>
                No thumbnail
              </div>
            )}
            <div style={{ padding: 12 }}>
              <strong style={{ fontSize: 15, color: '#fff' }}>{video.title}</strong>
              <p style={{ fontSize: 12, color: '#777', margin: '6px 0 0' }}>{video.status} · {video.moderation_status}</p>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && <p style={{ color: '#999' }}>You haven't uploaded any videos yet.</p>}
    </div>
  );
}

export default Profile;
