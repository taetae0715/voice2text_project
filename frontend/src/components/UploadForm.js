import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file

function UploadForm() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [docFile, setDocFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
    setFullText('');
    setDocFile('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    setSummary('');
    setFullText('');
    setDocFile('');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSummary(res.data.summary || '');
      setFullText(res.data.text || '');
      setDocFile(res.data.document_filename || '');
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ 오류 발생: 서버와 연결되지 않았어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <div className="icon-container">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16c-2.47 0-4.52-1.8-4.93-4.15-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      </div>
      <h2 className="form-title">Speech-to-Text Converter</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-wrapper">
          <input
            id="file-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-upload-label">
            {file ? file.name : "파일 선택"}
          </label>
        </div>

        {file && (
          <p className="file-name-display">
            선택한 파일: <strong>{file.name}</strong>
          </p>
        )}
        <button type="submit" className="submit-button" disabled={!file || loading}>
          {loading ? '변환 중...' : '변환하기'}
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>변환 중입니다... 잠시만 기다려 주세요.</p>
        </div>
      )}

      {errorMsg && (
        <p className="error-message">{errorMsg}</p>
      )}

      {(summary || fullText || docFile) && !loading && (
        <div className="results-container">
          {summary && (
            <div className="result-section">
              <h3>📌 요약 결과:</h3>
              <p>{summary}</p>
            </div>
          )}

          {fullText && (
             <div className="result-section">
               <h3>📝 전체 텍스트:</h3>
               <p>{fullText}</p>
             </div>
          )}

          {docFile && (
            <a
              href={`http://localhost:5000/doc/${docFile}`}
              download
              className="download-button"
            >
              ⬇ Word 문서 다운로드
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadForm;
