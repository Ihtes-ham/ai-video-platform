import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import UploadForm from './UploadForm';

function Home() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
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

      {videos.length > 0 && !searching && (
        <div
          onClick={() => navigate(`/video/${videos[0].id}`)}
          style={{
            position: 'relative', height: 320, borderRadius: 8, overflow: 'hidden',
            marginBottom: 32, cursor: 'pointer',
            background: videos[0].thumbnail
              ? `linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.2) 60%, rgba(20,20,20,0) 100%), url(${videos[0].thumbnail})`
              : 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={{ position: 'absolute', bottom: 30, left: 30, maxWidth: 500 }}>
            <span style={{ color: '#e50914', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
              FEATURED
            </span>
            <h2 style={{ color: '#fff', fontSize: 32, margin: '8px 0', fontWeight: 700 }}>
              {videos[0].title}
            </h2>
            <p style={{ color: '#ddd', fontSize: 15, lineHeight: 1.5 }}>
              {videos[0].description}
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/video/${video.id}`)}
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

      {showUpload && (
        <UploadForm onUploadSuccess={handleUploadSuccess} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

export default Home;