import React, { useRef, useState } from 'react';
import '../styles/menu.scss';

function Menu() {
  const dotRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const handleMouseEnter = () => {
    if (dotRef.current) {
      dotRef.current.style.animation = 'none';
    }
  };

  const handleMouseLeave = () => {
    if (dotRef.current) {
      dotRef.current.style.animation = 'pulse 1.5s ease-in-out infinite';
    }
  };

  const handleVwMenuClick = () => {
    setMenuVisible(true);
    setBubbleVisible(true);
  };

  const handleCircleMenuClick = () => {
    setMenuVisible(false);
    setBubbleVisible(false);
  };

  return (
    <div className="menu">
      <a
        className={`vw-menu ${menuVisible ? 'hidden' : 'visible'}`}
        href="#"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleVwMenuClick}
      >
        <svg
          width="60px"
          height="60px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          className="bi bi-exclamation"
        >
          <path
            className="exclamation-dot"
            d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"
            ref={dotRef}
          />
          <path
            className="exclamation-line"
            d="M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"
          />
        </svg>
      </a>

      <div
        className={`circle-menu ${menuVisible ? 'on visible' : ''}`}
        onClick={handleCircleMenuClick}
      >
        <ul className='bb-menu'>
          <li>
            test 글자 짱 큰 거
          </li>
          <li>
            test 글자 짱 큰 거
          </li>
          <li>
            test 글자 짱 큰 거
          </li>
        </ul>
      </div>

      {bubbleVisible && (
        <div className="bubble pop">
          <div className="bubble__main"></div>
          <div className="bubble__drop bubble__drop--1"></div>
          <div className="bubble__drop bubble__drop--2"></div>
          <div className="bubble__drop bubble__drop--3"></div>
          <div className="bubble__drop bubble__drop--4"></div>
          <div className="bubble__drop bubble__drop--5"></div>
          <div className="bubble__drop bubble__drop--6"></div>
          <div className="bubble__drop bubble__drop--7"></div>
          <div className="bubble__drop bubble__drop--8"></div>
        </div>
      )}
    </div>
  );
}

export default Menu;
