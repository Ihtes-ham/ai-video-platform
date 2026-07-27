import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profile() {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

  const loadPlaylists = () => {
    api.get('playlists/').then((res) => setPlaylists(res.data));
  };

  useEffect(() => {
    api.get('videos/').then((res) => setVideos(res.data));
    loadPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    await api.post('playlists/', { name: newPlaylistName });
    setNewPlaylistName('');
    loadPlaylists();
  };

  return (
    <div style={{ padding: '24px 40px' }}>
      <h2 style={{ color: '#fff', marginBottom: 4 }}>My Videos</h2>
      <p style={{ color: '#999', marginBottom: 24, fontSize: 14 }}>
        {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20, marginBottom: 40 }}>
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

      <h2 style={{ color: '#fff', marginBottom: 16 }}>My Playlists</h2>
      <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name..."
          style={{ padding: 10, background: '#333', border: 'none', borderRadius: 4, color: '#fff', width: 260 }}
        />
        <button type="submit" style={{ padding: '10px 18px', background: '#e50914', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Create
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {playlists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            style={{ background: '#1f1f1f', borderRadius: 6, padding: 16, width: 220, cursor: 'pointer' }}
          >
            <strong style={{ color: '#fff' }}>{pl.name}</strong>
            <p style={{ color: '#999', fontSize: 13, margin: '6px 0 0' }}>{pl.video_count} video{pl.video_count !== 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>

      {playlists.length === 0 && <p style={{ color: '#999' }}>No playlists yet — create one above.</p>}
    </div>
  );
}

export default Profile;