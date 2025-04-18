// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import RecordList from './components/RecordList';
import MyPage from './components/MyPage';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [micError, setMicError] = useState('');
  const [currentPage, setCurrentPage] = useState('main');

  useEffect(() => {
    // 마이크 권한 요청
    const requestMicPermission = async () => {
      try {
        // 먼저 사용 가능한 오디오 장치 확인
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        
        if (!hasAudioInput) {
          setMicError('마이크가 연결되어 있지 않습니다.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false
        });
        
        setHasMicPermission(true);
        setMicError('');
        // 스트림 해제
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('마이크 접근 권한 오류:', error);
        if (error.name === 'NotAllowedError') {
          setMicError('마이크 접근이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용해주세요.');
        } else if (error.name === 'NotFoundError') {
          setMicError('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
        } else {
          setMicError('마이크 접근 중 오류가 발생했습니다.');
        }
      }
    };

    requestMicPermission();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleToggleAuth = () => {
    setShowRegister(!showRegister);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onToggleAuth={handleToggleAuth} />
    ) : (
      <Login onToggleAuth={handleToggleAuth} onLogin={handleLogin} />
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
    <div className="App">
      {!hasMicPermission && micError && (
        <div className="mic-permission-warning">
          {micError}
        </div>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
