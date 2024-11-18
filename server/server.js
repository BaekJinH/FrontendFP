const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws'); // WebSocket 추가

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/feedback', (req, res) => {
  const { feedback } = req.body;
  const filePath = path.join(__dirname, 'feedback.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: '파일 읽기 오류' });
    }

    const feedbacks = data ? JSON.parse(data) : [];
    feedbacks.push({ feedback, date: new Date().toISOString() });

    fs.writeFile(filePath, JSON.stringify(feedbacks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: '파일 저장 오류' });
      }
      res.status(200).json({ message: '피드백 저장 성공' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`HTTP 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

// WebSocket 서버 설정
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log(`받은 메시지: ${message}`);
    // 모든 클라이언트에게 메시지 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('클라이언트 연결이 닫혔습니다.');
  });
});

console.log('WebSocket 서버가 포트 8080에서 실행 중입니다.');