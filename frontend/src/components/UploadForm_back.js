import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(res.data.text);
    } catch (err) {
      console.error(err);
      setResponse("❌ 오류 발생: 서버와 연결되지 않았어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
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

      {response && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          color: '#333'
        }}>
          <strong>📝 변환 결과:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
