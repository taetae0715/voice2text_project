import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{
      maxWidth: '700px',
      margin: '60px auto',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f9fbfc'
    }}>
      <h2 style={{ textAlign: 'center', color: '#007BFF' }}>🎧 음성 텍스트 변환기</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px', textAlign: 'center' }}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        <br />
        {file && (
          <p style={{ fontSize: '14px', color: '#555' }}>
            선택한 파일: <strong>{file.name}</strong>
          </p>
        )}
        <button
          type="submit"
          style={{
            padding: '10px 30px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            marginTop: '10px'
          }}
        >
          🔄 변환하기
        </button>
      </form>

      {loading && (
        <p style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
          🔁 변환 중입니다... 잠시만 기다려 주세요.
        </p>
      )}

      {errorMsg && (
        <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{errorMsg}</p>
      )}

      {(summary || fullText) && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          color: '#333'
        }}>
          {summary && (
            <>
              <strong>📌 요약 결과:</strong>
              <p>{summary}</p>
            </>
          )}

          {fullText && (
            <>
              <strong>📝 전체 텍스트:</strong>
              <p>{fullText}</p>
            </>
          )}

          {docFile && (
            <a
              href={`http://localhost:5000/doc/${docFile}`}
              download
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
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
