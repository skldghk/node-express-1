require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결 설정
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB에 연결되었습니다.'))
  .catch(err => console.error('MongoDB 연결 오류:', err));

// 할일 모델 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true }
});
const Todo = mongoose.model('Todo', todoSchema);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); // 정적 파일 제공

// 할일 목록 조회
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('할일 목록 조회 오류:', error);
    res.status(500).json({ message: error.message });
  }
});

// 할일 추가
app.post('/todos', async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: '제목, 내용, 우선순위는 필수입니다.' });
  }

  const todo = new Todo({ title, description, priority });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('할일 추가 오류:', error);
    res.status(500).json({ message: error.message });
  }
});

// 할일 삭제
app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: '해당 ID의 할일을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('할일 삭제 오류:', error);
    res.status(500).json({ message: error.message });
  }
});

// 루트 경로 라우트 핸들러 추가
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
});
