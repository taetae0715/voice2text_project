const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // 이메일 중복 확인
    const [existingUsers] = await db.query('SELECT * FROM tb_v2t_usr_info WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const [result] = await db.query(
      'INSERT INTO tb_v2t_usr_info (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 확인
    const [users] = await db.query('SELECT * FROM tb_v2t_usr_info WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: users[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      userId: users[0].id, 
      name: users[0].name 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 비밀번호 재설정 요청
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 사용자 확인
    const [users] = await db.query('SELECT * FROM tb_v2t_usr_info WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: '등록되지 않은 이메일입니다.' });
    }

    const user = users[0];
    const token = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 3600000); // 1시간 후 만료

    // 토큰 저장
    await db.query(
      'INSERT INTO tb_v2t_pwd_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    // 이메일 전송
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '비밀번호 재설정',
      html: `
        <p>비밀번호 재설정을 요청하셨습니다.</p>
        <p>아래 링크를 클릭하여 비밀번호를 재설정하세요:</p>
        <a href="${resetLink}">비밀번호 재설정</a>
        <p>이 링크는 1시간 동안만 유효합니다.</p>
      `
    });

    res.json({ message: '비밀번호 재설정 이메일이 전송되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 비밀번호 재설정
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // 토큰 확인
    const [tokens] = await db.query(
      'SELECT * FROM tb_v2t_pwd_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
    }

    const resetToken = tokens[0];

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 비밀번호 업데이트
    await db.query('UPDATE tb_v2t_usr_info SET password = ? WHERE id = ?', [
      hashedPassword,
      resetToken.user_id
    ]);

    // 토큰 삭제
    await db.query('DELETE FROM tb_v2t_pwd_reset_tokens WHERE token = ?', [token]);

    res.json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 