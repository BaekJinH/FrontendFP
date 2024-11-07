const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // CORS 추가

const app = express();
const PORT = 3001;

app.use(cors()); // CORS 미들웨어 사용
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
  console.log(`Server is running on http://localhost:${PORT}`);
});