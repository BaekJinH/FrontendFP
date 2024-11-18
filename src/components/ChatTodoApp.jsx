import React, { useState, useEffect, useRef } from 'react';
import '../styles/chatTodoApp.scss';

const ChatTodoApp = React.forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [nickname, setNickname] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const randomNickname = `User${Math.floor(Math.random() * 1000)}`;
    setNickname(randomNickname);

    const now = new Date();
    const koreanTime = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    }).format(now);

    setMessages((prevMessages) => [
      ...prevMessages,
      `${randomNickname}가 입장했습니다. (${koreanTime})`
    ]);

    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onopen = () => {
      console.log('WebSocket 연결이 열렸습니다.');
    };

    socketRef.current.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const message = reader.result;
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      reader.readAsText(event.data);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket 연결이 닫혔습니다.');
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = `${nickname}: ${newMessage}`;
      socketRef.current.send(userMessage);
      setNewMessage('');
    }
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (index) => {
    if (window.confirm('정말 제거하시겠습니까?')) {
      setTodos(todos.filter((_, i) => i !== index));
    }
  };

  const toggleComplete = (index) => {
    setTodos(todos.map((todo, i) => 
      i === index ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <section id='ChatTodoApp' ref={ref}>
      <div className='chat-todo-inner'>
        <h2>Chat & Todo App</h2>
        
        <div>
          <h3>Chat</h3>
          <div className='chat-room'>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <div className='chat-input'>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지 입력"
              />
              <button type="submit">전송</button>
            </form>
          </div>
        </div>
  
        <div>
          <h3>Todo List</h3>
          <ul className='todo-list'>
            {todos.map((todo, index) => (
              <li key={index}>
                <p className={todo.completed ? 'completed' : ''}>{todo.text}</p>
                <button className='check-radio' onClick={() => toggleComplete(index)}>
                  {todo.completed ? '' : ''}
                </button>
                <button onClick={() => deleteTodo(index)}>제거</button>
              </li>
            ))}
          </ul>
          <div className='todo-input'>
            <form onSubmit={addTodo}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="할 일 추가"
              />
              <button type="submit">추가</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ChatTodoApp; 