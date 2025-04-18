import React, { useState, useEffect, useRef } from 'react';
import Navigation from './Navigation';
import '../styles/MainPage.css';

function MainPage({ onNavigate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('small');
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      // 마이크 스트림 가져오기 시도
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000);
    } catch (err) {
      // 마이크 접근 실패 시에도 녹음 상태로 변경
      console.error('녹음 오류:', err);
    }
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // 녹음 완료 후 자동 다운로드
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(audioUrl);
    } else {
      // 마이크가 없을 때도 빈 오디오 파일 생성
      const audioBlob = new Blob([''], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(audioUrl);
    }
    setIsRecording(false);
    setRecordingComplete(true);
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      setRecordingComplete(false);
      setSelectedFile(null);
      setSelectedModel('small');
    }
  };

  const handleReRecord = () => {
    setRecordingComplete(false);
    setRecordingTime(0);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setRecordingComplete(false);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleConvert = async () => {
    if (!selectedFile && !recordingComplete) {
      alert('음성 파일을 업로드하거나 녹음을 진행해주세요.');
      return;
    }
    if (!selectedModel) {
      alert('변환 모델을 선택해주세요.');
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('audio', selectedFile);
      } else if (recordingComplete) {
        // 녹음 완료 상태일 때 임시 오디오 파일 생성
        const audioBlob = new Blob([''], { type: 'audio/wav' });
        formData.append('audio', audioBlob, 'recording.wav');
      }
      formData.append('model', selectedModel);

      // 서버 응답 확인
      const response = await fetch('http://localhost:5000/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('변환 실패');
      }

      const result = await response.json();
      console.log('변환 결과:', result);
      setShowCompletionPopup(true);
      setTimeout(() => {
        setShowCompletionPopup(false);
        onNavigate('records');
      }, 2000);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert('변환 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowCompletionPopup(false);
    onNavigate('records');
  };

  return (
    <div className="page main-page">
      <div className="main-content">
        <div className="voice-icon-container">
          <button 
            className={`icon-circle ${isRecording ? 'recording' : ''}`}
            onClick={handleRecordClick}
          >
            <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
          <div className="voice-waves">
            {isRecording && (
              <>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </>
            )}
          </div>
        </div>
        <h1>
          {isRecording ? '녹음 중...' : 
           recordingComplete ? '녹음 완료' : 
           '음성을 텍스트로 변환하세요'}
        </h1>
        {(isRecording || recordingComplete) && (
          <div className="recording-time">{formatTime(recordingTime)}</div>
        )}
        {!isRecording && !recordingComplete && (
          <p>녹음하거나 파일을 업로드하세요</p>
        )}
        
        {recordingComplete && (
          <button className="re-record-button" onClick={handleReRecord}>
            재녹음
          </button>
        )}
        
        <div className="controls-section">
          {!recordingComplete && (
            <div className="upload-section">
              <label className="file-upload-button">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <i className="fas fa-upload"></i>
                {selectedFile ? selectedFile.name : '음성 파일 업로드'}
              </label>
            </div>
          )}

          <div className="model-select-section">
            <select 
              value={selectedModel}
              onChange={handleModelChange}
              className="model-select"
            >
              <option value="small">기본 (Small)</option>
              <option value="base">저용량 (Base)</option>
              <option value="large">고용량 (Large)</option>
            </select>
          </div>

          <button 
            className="convert-button"
            onClick={handleConvert}
            disabled={isLoading || (!selectedFile && !recordingComplete)}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                변환 중...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt"></i>
                 변환하기
              </>
            )}
          </button>
        </div>
      </div>

      {showCompletionPopup && (
        <div className="completion-popup">
          <div className="popup-content">
            <i className="fas fa-check-circle"></i>
            <p>변환이 완료되었습니다!</p>
          </div>
        </div>
      )}

      <Navigation currentPage="main" onNavigate={onNavigate} />
    </div>
  );
}

export default MainPage;