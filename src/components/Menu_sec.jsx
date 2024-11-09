import React, { useState, useRef } from 'react';
import '../styles/menu_sec.scss';

const MenuSec = () => {
  const [isActive, setIsActive] = useState(false);
  const [isClass, setIsClass] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const buttonWrapperRef = useRef(null);
  const layerRef = useRef(null);

  const handleMainButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsTimer(true);
    }, 900);
    setTimeout(() => {
      setIsActive(true);
    }, 1500);

  };

  const handleCloseButtonClick = () => {
    setIsActive(false);
    setIsTimer(false);
    setTimeout(() => {
      setIsClicked(false);
    }, 3000);
  };

  return (
    <>
      <button className={`main-button fake-button fa fa-plus ${isClicked ? 'hide' : ''}`} onClick={handleMainButtonClick}>
        <svg
          width="54px"
          height="54px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          className="bi bi-exclamation"
        >
          <path
            className="exclamation-dot"
            d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"
            fill="#000"
          />
          <path
            className="exclamation-line"
            d="M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"
            fill="#000"
          />
        </svg>
      </button>
      <div className={`interact-menu ${isClicked ? 'visible' : ''}`}>
        <div className={`button-wrapper ${isTimer ? 'clicked' : ''}`} ref={buttonWrapperRef}>
          <div className={`layer ${isTimer ? 'active' : ''}`}></div>
          <button className={`main-button fa fa-plus ${isClicked ? 'visible' : ''}`}>
            <svg
              width="54px"
              height="54px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              className="bi bi-exclamation"
            >
              <path
                className="exclamation-dot"
                d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"
                fill="#000"
              />
              <path
                className="exclamation-line"
                d="M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"
                fill="#000"
              />
            </svg>
          </button>
        </div>
        <div className={`layered-content ${isActive ? 'active' : ''}`} ref={layerRef}>
          <button className="close-button" onClick={handleCloseButtonClick}>
            <svg
              width="54px"  
              height="54px" 
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
            >
              <g transform="scale(0.25) translate(16, 16)"> 
                <path d="M15.255,0c5.424,0,10.764,2.498,10.764,8.473c0,5.51-6.314,7.629-7.67,9.62c-1.018,1.481-0.678,3.562-3.475,3.562
                c-1.822,0-2.712-1.482-2.712-2.838c0-5.046,7.414-6.188,7.414-10.343c0-2.287-1.522-3.643-4.066-3.643
                c-5.424,0-3.306,5.592-7.414,5.592c-1.483,0-2.756-0.89-2.756-2.584C5.339,3.683,10.084,0,15.255,0z M15.044,24.406
                c1.904,0,3.475,1.566,3.475,3.476c0,1.91-1.568,3.476-3.475,3.476c-1.907,0-3.476-1.564-3.476-3.476
                C11.568,25.973,13.137,24.406,15.044,24.406z"/>
              </g>
            </svg>
          </button>
          <ul className="content">
            <li>
              <a href="mailto:wlsgur_bloom@naver.com" >
                <div className="bg"></div>
                wlsgur_bloom@naver.com
              </a>
            </li>
            <li>
              <a href="tel:010-8681-6741">
                <div className="bg"></div>
                010-8681-6741
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MenuSec;
