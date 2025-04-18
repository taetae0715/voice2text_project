// frontend/src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import RecordList from './components/RecordList';
import MyPage from './components/MyPage';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('main');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return isLogin ? (
      <Login onToggleAuth={toggleAuth} onLogin={handleLogin} />
    ) : (
      <Register onToggleAuth={toggleAuth} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage onNavigate={handleNavigate} />;
      case 'records':
        return <RecordList onNavigate={handleNavigate} />;
      case 'mypage':
        return <MyPage onLogout={handleLogout} onNavigate={handleNavigate} />;
      default:
        return <MainPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;
