import React, { useState } from 'react';
import api from '../api';

function UploadForm({ onUploadSuccess, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      await api.post('videos/', formData);
      setUploading(false);
      onUploadSuccess();
    } catch (err) {
      setUploading(false);
      setError('Upload failed. Please try again.');
    }
  };

  const inputStyle = {
    display: 'block', width: '100%', marginBottom: 12, padding: 12,
    background: '#333', border: 'none', borderRadius: 4, color: '#fff', fontSize: 14,
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{ background: '#181818', padding: 28, borderRadius: 6, width: 400 }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>Upload Video</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: 70, fontFamily: 'inherit' }} />
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 14, color: '#ccc' }} />
          {error && <p style={{ color: '#e87c03', fontSize: 13 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={uploading} style={{
              padding: '10px 20px', background: '#e50914', color: '#fff',
              border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer',
            }}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', background: 'transparent', color: '#ccc',
              border: '1px solid #555', borderRadius: 4, cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;
