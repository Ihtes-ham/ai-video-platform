import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function VideoPlayer({ video, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video.hls_url) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.hls_url);
      hls.attachMedia(videoEl);
      return () => hls.destroy();
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = video.hls_url;
    }
  }, [video]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{ background: '#181818', padding: 20, borderRadius: 6, maxWidth: 720, width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#fff', margin: 0 }}>{video.title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        <video ref={videoRef} controls style={{ width: '100%', borderRadius: 4, background: '#000' }} />
        <p style={{ color: '#aaa', marginTop: 12, fontSize: 14 }}>{video.description}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;
