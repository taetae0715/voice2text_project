import React, { useState, useEffect } from 'react';
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
  const [editedFullText, setEditedFullText] = useState('');
  const [playingRecord, setPlayingRecord] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState({});
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/records');
      if (!response.ok) {
        throw new Error('데이터를 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSummary = (id) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteClick = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/records/${record.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('삭제 실패');
      }
      
      setRecords(prevRecords => prevRecords.filter(r => r.id !== record.id));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setRecordToDelete(null);
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditedTitle(record.audio_filename);
    setEditedSummary(record.summary);
    setEditedFullText(record.full_text);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/records/${editingRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary_text: editedSummary,
          full_text: editedFullText
        })
      });
      
      if (!response.ok) {
        throw new Error('수정 실패');
      }
      
      setRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === editingRecord.id 
            ? { ...record, summary_text: editedSummary, full_text: editedFullText }
            : record
        )
      );
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handlePlayClick = async (record) => {
    if (playingRecord && playingRecord.id === record.id) {
      setPlayingRecord(null);
      // TODO: 실제 오디오 정지 로직 구현
    } else {
      try {
        const response = await fetch(`http://localhost:5000/records/${record.id}/audio`);
        if (!response.ok) {
          throw new Error('오디오 파일을 가져오는데 실패했습니다.');
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (playingRecord) {
          // 이전 오디오 정지
          const prevAudio = document.getElementById(`audio-${playingRecord.id}`);
          if (prevAudio) {
            prevAudio.pause();
            prevAudio.currentTime = 0;
          }
        }
        
        // 새로운 오디오 재생
        const audio = new Audio(audioUrl);
        audio.id = `audio-${record.id}`;
        audio.play();
        setPlayingRecord(record);
        
        audio.onended = () => {
          setPlayingRecord(null);
          URL.revokeObjectURL(audioUrl);
        };
      } catch (error) {
        console.error('오디오 재생 중 오류:', error);
        alert('오디오 재생 중 오류가 발생했습니다.');
      }
    }
  };

  const handleFormatChange = (recordId, format) => {
    setDownloadFormat(prev => ({
      ...prev,
      [recordId]: format
    }));
  };

  const handleDownload = async (record) => {
    const format = downloadFormat[record.id] || 'txt';
    
    try {
      const response = await fetch(`http://localhost:5000/records/${record.id}/download/${format}`);
      
      if (!response.ok) {
        throw new Error('다운로드 실패');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${record.audio_filename}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    if (searchType === 'title') {
      return record.audio_filename.toLowerCase().includes(searchLower);
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
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : (
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
                      <h2 className="record-title">{record.audio_filename}</h2>
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
                    <>
                      <textarea
                        value={editedSummary}
                        onChange={(e) => setEditedSummary(e.target.value)}
                        className="edit-summary-input"
                        placeholder="요약 내용을 입력하세요"
                      />
                      <textarea
                        value={editedFullText}
                        onChange={(e) => setEditedFullText(e.target.value)}
                        className="edit-fulltext-input"
                        placeholder="전체 내용을 입력하세요"
                      />
                    </>
                  ) : (
                    <>
                      <div className={`summary-text ${expandedSummaries[record.id] ? 'expanded' : ''}`}>
                        {expandedSummaries[record.id] ? record.full_text : record.summary}
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
        )}
      </div>
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h2>녹음 삭제</h2>
            <p>"{recordToDelete?.audio_filename}" 녹음을 삭제하시겠습니까?</p>
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