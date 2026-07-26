import React, { useEffect, useState } from 'react';
import api from '../api';
import VideoPlayer from './VideoPlayer';
import UploadForm from './UploadForm';

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const loadAllVideos = () => {
    api.get('videos/').then((res) => setVideos(res.data));
    setSearching(false);
  };

  useEffect(() => {
    loadAllVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      loadAllVideos();
      return;
    }
    setSearching(true);
    api.get(`videos/search/?q=${encodeURIComponent(query)}`).then((res) => setVideos(res.data));
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    loadAllVideos();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: '24px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ color: '#e50914', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: 0.5 }}>
          StreamAI
        </h1>
        <button
          onClick={() => setShowUpload(true)}
          style={{
            background: '#e50914', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 4, fontWeight: 600,
            cursor: 'pointer', fontSize: 14,
          }}
        >
          + Upload
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 32, display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by meaning — try 'introduction' or 'vacation'..."
          style={{
            padding: '10px 14px', width: 360, background: '#333',
            border: '1px solid #555', borderRadius: 4, color: '#fff', fontSize: 14,
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px', background: '#333', color: '#fff',
          border: '1px solid #555', borderRadius: 4, cursor: 'pointer',
        }}>
          Search
        </button>
        {searching && (
          <button
            type="button"
            onClick={() => { setQuery(''); loadAllVideos(); }}
            style={{
              padding: '10px 20px', background: 'transparent', color: '#aaa',
              border: '1px solid #555', borderRadius: 4, cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="video-card"
            style={{
              background: '#1f1f1f', borderRadius: 6, overflow: 'hidden',
              cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: 140, background: '#2a2a2a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#555', fontSize: 13,
              }}>
                No thumbnail
              </div>
            )}
            <div style={{ padding: 12 }}>
              <strong style={{ fontSize: 15, color: '#fff' }}>{video.title}</strong>
              <p style={{ fontSize: 13, color: '#999', margin: '6px 0 0', lineHeight: 1.4 }}>
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && searching && (
        <p style={{ color: '#999', marginTop: 20 }}>No results found.</p>
      )}

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {showUpload && (
        <UploadForm onUploadSuccess={handleUploadSuccess} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

export default VideoList;
