import React, { useState } from 'react';
import '../styles/Auth.css';
import axios from 'axios';

function Login({ onToggleAuth, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === 'admin' && password === '1234') {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin'
      }));
      onLogin();
      setError('');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/auth/forgot-password', {
        email: resetEmail
      });
      setResetStatus('입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetStatus('');
      }, 3000);
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setResetStatus(error.response.data.message);
      } else if (error.message) {
        setResetStatus(error.message);
      } else {
        setResetStatus('비밀번호 재설정 요청 중 오류가 발생했습니다.');
      }
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus('이메일을 입력해주세요.');
      return;
    }
    // 실제로는 여기서 비밀번호 재설정 이메일을 보내는 API를 호출합니다
    setResetStatus('입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.');
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail('');
      setResetStatus('');
    }, 3000);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo-container">
          <img src="/voice-recording.svg" alt="voice recording" className="logo-icon" />
          <h1 className="logo-text">Speech-to-Text</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">로그인</button>
        </form>

        <div className="auth-links">
          <button onClick={handleForgotPassword} className="text-button">
            비밀번호 찾기
          </button>
          <button onClick={onToggleAuth} className="text-button">
            회원가입
          </button>
        </div>

        <div className="social-login">
          <button className="social-button facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-button google">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-button twitter">
            <i className="fab fa-twitter"></i>
          </button>
        </div>
      </div>

      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>비밀번호 찾기</h2>
            <p>가입하신 이메일을 입력해 주세요.</p>
            <form onSubmit={handleResetPassword} className="reset-password-form">
              <div className="input-group">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                />
              </div>
              {resetStatus && (
                <p className={resetStatus.includes('전송') ? 'success-message' : 'error-message'}>
                  {resetStatus}
                </p>
              )}
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowForgotPassword(false)}>
                  취소
                </button>
                <button type="submit" className="auth-button">
                  비밀번호 전송하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login; 