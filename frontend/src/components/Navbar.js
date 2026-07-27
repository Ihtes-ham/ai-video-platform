import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 40px', background: '#000', borderBottom: '1px solid #222',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ color: '#e50914', fontSize: 22, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}
      >
        StreamAI
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span
          onClick={() => navigate('/')}
          style={{
            color: location.pathname === '/' ? '#fff' : '#999',
            cursor: 'pointer', fontSize: 14, fontWeight: 500,
            borderBottom: location.pathname === '/' ? '2px solid #e50914' : 'none',
            paddingBottom: 4,
          }}
        >
          Home
        </span>

        <span
          onClick={() => navigate('/trending')}
          style={{
            color: location.pathname === '/trending' ? '#fff' : '#999',
            cursor: 'pointer', fontSize: 14, fontWeight: 500,
            borderBottom: location.pathname === '/trending' ? '2px solid #e50914' : 'none',
            paddingBottom: 4,
          }}
        >
          Trending
        </span>

        <span
          onClick={() => navigate('/profile')}
          style={{
            color: location.pathname === '/profile' ? '#fff' : '#999',
            cursor: 'pointer', fontSize: 14, fontWeight: 500,
            borderBottom: location.pathname === '/profile' ? '2px solid #e50914' : 'none',
            paddingBottom: 4,
          }}
        >
          My Profile
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', color: '#999', border: '1px solid #444',
            padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;