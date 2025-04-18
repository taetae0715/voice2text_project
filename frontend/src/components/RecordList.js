import React, { useState } from 'react';
import Navigation from './Navigation';
import '../styles/RecordList.css';

function RecordList({ onNavigate }) {
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [playingRecord, setPlayingRecord] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState({});
  const [records, setRecords] = useState([
    {
      id: 1,
      title: "2024년 3월 15일 회의",
      date: "2024-03-15 14:30",
      duration: "45:30",
      summary: "프로젝트 진행상황 논의 및 일정 조정. 주요 논의 사항: 1) 디자인 시스템 구축 2) API 연동 3) 테스트 계획"
    },
    {
      id: 2,
      title: "주간 업무 보고",
      date: "2024-03-14 10:00",
      duration: "15:20",
      summary: "이번 주 진행한 작업 보고 및 다음 주 계획 수립. 팀원들의 진행상황 공유 및 블로커 이슈 논의."
    },
    {
      id: 3,
      title: "클라이언트 미팅",
      date: "2024-03-13 11:00",
      duration: "30:15",
      summary: "신규 기능 요구사항 논의 및 일정 조율. 클라이언트 피드백 수렴 및 우선순위 조정."
    }
  ]);

  const toggleSummary = (id) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // 실제 삭제 로직 구현
    setRecords(prevRecords => prevRecords.filter(record => record.id !== recordToDelete.id));
    setShowDeleteConfirm(false);
    setRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setRecordToDelete(null);
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditedTitle(record.title);
    setEditedSummary(record.summary);
  };

  const handleSaveEdit = () => {
    // 실제 수정 로직 구현
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === editingRecord.id 
          ? { ...record, title: editedTitle, summary: editedSummary } 
          : record
      )
    );
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handlePlayClick = (record) => {
    if (playingRecord && playingRecord.id === record.id) {
      // 현재 재생 중인 녹음을 정지
      setPlayingRecord(null);
      // TODO: 실제 오디오 정지 로직 구현
      console.log('정지:', record.title);
    } else {
      // 다른 녹음이 재생 중이면 정지하고 새로운 녹음을 재생
      if (playingRecord) {
        // TODO: 이전 오디오 정지 로직 구현
        console.log('이전 녹음 정지:', playingRecord.title);
      }
      setPlayingRecord(record);
      // TODO: 실제 오디오 재생 로직 구현
      console.log('재생:', record.title);
    }
  };

  const handleFormatChange = (recordId, format) => {
    setDownloadFormat(prev => ({
      ...prev,
      [recordId]: format
    }));
  };

  const handleDownload = (record) => {
    const format = downloadFormat[record.id] || 'txt';
    console.log(`다운로드: ${record.title} (${format} 형식)`);
    
    // 실제 다운로드 로직 구현
    // 여기서는 간단한 예시만 구현
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch(format) {
      case 'txt':
        content = `제목: ${record.title}\n날짜: ${record.date}\n시간: ${record.duration}\n\n요약:\n${record.summary}`;
        filename = `${record.title}.txt`;
        mimeType = 'text/plain';
        break;
      case 'pdf':
        // PDF 생성 로직은 서버 측에서 처리하는 것이 좋습니다
        console.log('PDF 다운로드 요청');
        return;
      case 'excel':
        // 엑셀 생성 로직은 서버 측에서 처리하는 것이 좋습니다
        console.log('엑셀 다운로드 요청');
        return;
      default:
        content = `제목: ${record.title}\n날짜: ${record.date}\n시간: ${record.duration}\n\n요약:\n${record.summary}`;
        filename = `${record.title}.txt`;
        mimeType = 'text/plain';
    }
    
    // 파일 다운로드
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    if (searchType === 'title') {
      return record.title.toLowerCase().includes(searchLower);
    } else {
      return record.summary.toLowerCase().includes(searchLower);
    }
  });

  return (
    <div className="record-list-page">
      <div className="record-list">
        <div className="record-list-header">
          <h1>녹음 목록</h1>
          <div className="search-container">
            <div className="search-box">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select">
                <option value="title">제목</option>
                <option value="content">내용</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        <div className="records-container">
          {filteredRecords.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-card-header">
                <div className="record-info">
                  {editingRecord?.id === record.id ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="edit-title-input"
                    />
                  ) : (
                    <h2 className="record-title">{record.title}</h2>
                  )}
                  <p className="record-date">{record.date}</p>
                </div>
                <div className="record-controls">
                  <span className="record-duration">{record.duration}</span>
                  <button 
                    className={`play-button ${playingRecord?.id === record.id ? 'playing' : ''}`}
                    onClick={() => handlePlayClick(record)}
                  >
                    <i className={`fas ${playingRecord?.id === record.id ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                </div>
              </div>
              <div className="record-card-content">
                <h3 className="summary-label">녹음 AI 요약</h3>
                {editingRecord?.id === record.id ? (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="edit-summary-input"
                  />
                ) : (
                  <>
                    <div className={`summary-text ${expandedSummaries[record.id] ? 'expanded' : ''}`}>
                      {record.summary}
                    </div>
                    <button 
                      className="expand-button"
                      onClick={() => toggleSummary(record.id)}
                    >
                      {expandedSummaries[record.id] ? '접기' : '더 보기'}
                    </button>
                  </>
                )}
              </div>
              <div className="record-card-actions">
                <div className="record-actions">
                  {editingRecord?.id === record.id ? (
                    <>
                      <button 
                        className="save-button"
                        onClick={handleSaveEdit}
                      >
                        <i className="fas fa-save"></i>
                        <span>저장</span>
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={handleCancelEdit}
                      >
                        <i className="fas fa-times"></i>
                        <span>취소</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditClick(record)}
                      >
                        <i className="fas fa-edit"></i>
                        <span>수정</span>
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(record)}
                      >
                        <i className="fas fa-trash"></i>
                        <span>삭제</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="record-card-download">
                <div className="download-container">
                  <select 
                    className="download-format-select"
                    value={downloadFormat[record.id] || 'txt'}
                    onChange={(e) => handleFormatChange(record.id, e.target.value)}
                  >
                    <option value="txt">TXT 파일</option>
                    <option value="pdf">PDF 파일</option>
                    <option value="excel">엑셀 파일</option>
                  </select>
                  <button 
                    className="download-button"
                    onClick={() => handleDownload(record)}
                  >
                    <i className="fas fa-download"></i>
                    <span>다운로드</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h2>녹음 삭제</h2>
            <p>"{recordToDelete?.title}" 녹음을 삭제하시겠습니까?</p>
            <div className="modal-buttons">
              <button 
                className="submit-button"
                onClick={handleConfirmDelete}
              >
                삭제
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancelDelete}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <Navigation currentPage="records" onNavigate={onNavigate} />
    </div>
  );
}

export default RecordList; 