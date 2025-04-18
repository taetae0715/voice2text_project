import React from 'react';
import '../styles/Navigation.css';

function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button 
          className={`nav-item ${currentPage === 'main' ? 'active' : ''}`}
          onClick={() => onNavigate('main')}
        >
          <i className="fas fa-microphone"></i>
          <span>메인</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'records' ? 'active' : ''}`}
          onClick={() => onNavigate('records')}
        >
          <i className="fas fa-list"></i>
          <span>녹음목록</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'mypage' ? 'active' : ''}`}
          onClick={() => onNavigate('mypage')}
        >
          <i className="fas fa-user"></i>
          <span>마이페이지</span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation; 