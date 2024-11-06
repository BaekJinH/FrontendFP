import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.scss'; // 메인 SCSS 파일을 임포트

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
