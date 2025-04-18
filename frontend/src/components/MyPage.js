import React, { useState } from 'react';
import Navigation from './Navigation';
import '../styles/MyPage.css';

function MyPage({ onLogout, onNavigate }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validatePassword = () => {
    const newErrors = {};
    
    // 현재 비밀번호 검증
    if (!currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }
    
    // 새 비밀번호 검증
    if (!newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.';
    }
    
    // 비밀번호 확인 검증
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPasswordChange = () => {
    // 여기에 비밀번호 변경 API 호출 로직 추가
    setShowConfirmModal(false);
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <div className="mypage">
      <div className="mypage-content">
        <h1>마이페이지</h1>
        <div className="user-info">
          <div className="profile-section">
            <div className="profile-image">
              <i className="fas fa-user"></i>
            </div>
            <h2>사용자 이름</h2>
            <p>user@example.com</p>
            <button className="change-password-button" onClick={() => setShowPasswordModal(true)}>
              비밀번호 변경
            </button>
          </div>
        </div>
        
        <div className="recording-status-section">
          <h2>녹음 현황</h2>
          <div className="status-list">
            <div className="status-item">
              <i className="fas fa-microphone"></i>
              <span>총 녹음 수</span>
              <span className="status-value">24개</span>
            </div>
            <div className="status-item">
              <i className="fas fa-clock"></i>
              <span>총 녹음 시간</span>
              <span className="status-value">12시간 30분</span>
            </div>
            <div className="status-item">
              <i className="fas fa-calendar"></i>
              <span>이번 달 녹음</span>
              <span className="status-value">8개</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-button" onClick={() => onNavigate('records')}>
            <i className="fas fa-list"></i>
            <span>녹음 목록</span>
          </button>
          <button className="action-button">
            <i className="fas fa-chart-bar"></i>
            <span>월별 녹음 통계</span>
          </button>
          <button className="action-button logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={errors.currentPassword ? 'error' : ''}
                />
                {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.newPassword ? 'error' : ''}
                />
                {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button">변경</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setErrors({});
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h2>비밀번호 변경 확인</h2>
            <p>비밀번호를 변경하시겠습니까?</p>
            <div className="modal-buttons">
              <button 
                className="submit-button"
                onClick={handleConfirmPasswordChange}
              >
                확인
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation currentPage="mypage" onNavigate={onNavigate} />
    </div>
  );
}

export default MyPage;