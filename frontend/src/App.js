import React, { useState } from 'react';
import Login from './pages/Login';
import VideoList from './pages/VideoList';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('access_token'));

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <VideoList />;
}

export default App;
