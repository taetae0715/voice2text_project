import React, { useState } from 'react';
import '../styles/Auth.css';

function Register({ onToggleAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // Here you would typically make an API call to register the user
    alert('회원가입이 완료되었습니다. 로그인해주세요.');
    onToggleAuth();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="아이디"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">회원가입</button>
        </form>

        <div className="auth-links">
          <p>이미 계정이 있으신가요?</p>
          <button onClick={onToggleAuth} className="text-button">
            로그인하기
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
    </div>
  );
}

export default Register; 