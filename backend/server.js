const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
require('dotenv').config();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON 파싱 미들웨어
app.use(express.json());

// OPTIONS 요청 처리
app.options('*', cors());

// 라우트 설정
app.use('/api/auth', authRoutes);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 