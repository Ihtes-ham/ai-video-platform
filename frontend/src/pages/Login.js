import React, { useState } from 'react';
import api from '../api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      onLogin();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#141414', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 360, padding: 40, background: '#000', borderRadius: 6 }}>
        <h1 style={{ color: '#e50914', fontSize: 26, marginBottom: 24, fontWeight: 700 }}>
          StreamAI
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              display: 'block', width: '100%', marginBottom: 12, padding: 12,
              background: '#333', border: 'none', borderRadius: 4, color: '#fff', fontSize: 14,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: 'block', width: '100%', marginBottom: 16, padding: 12,
              background: '#333', border: 'none', borderRadius: 4, color: '#fff', fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%', padding: 12, background: '#e50914', color: '#fff',
              border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>
        {error && <p style={{ color: '#e87c03', marginTop: 12, fontSize: 13 }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
