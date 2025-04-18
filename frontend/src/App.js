// frontend/src/App.js
import React, { useState } from 'react';
import './styles/App.css';
import Login from './components/Login';
import MainPage from './components/MainPage';
import RecordList from './components/RecordList';
import MyPage from './components/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {currentPage === 'main' && <MainPage onNavigate={handleNavigate} />}
      {currentPage === 'records' && <RecordList onNavigate={handleNavigate} />}
      {currentPage === 'mypage' && <MyPage onNavigate={handleNavigate} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
