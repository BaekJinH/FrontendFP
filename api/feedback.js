const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = initializeApp();
const db = getFirestore();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { feedback } = req.body;

    try {
      const docRef = db.collection('feedbacks').doc();
      await docRef.set({ feedback, date: new Date().toISOString() });

      res.status(200).json({ message: '피드백 저장 성공' });
    } catch (err) {
      res.status(500).json({ message: '데이터베이스 오류', error: err.message });
    }
  } else {
    res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }
};
