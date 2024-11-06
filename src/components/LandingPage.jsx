import React, { useState, useEffect, useRef } from 'react';
import '../styles/LandingPage.scss';

function LandingPage({ onLandingComplete }) {
  const [isLandingComplete, setIsLandingComplete] = useState(false);
  const [isDotTransformed, setIsDotTransformed] = useState(false);
  const [textHeight, setTextHeight] = useState(80); // 초기값 설정
  const textRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLandingComplete(true);
      setIsDotTransformed(true);
      onLandingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLandingComplete]);

  useEffect(() => {
    // 텍스트 높이를 구한 후 상태에 저장
    if (textRef.current) {
      setTextHeight(textRef.current.clientHeight);
    }
  }, []);

  return (
    <main className={`landing ${isLandingComplete ? 'landing-complete' : ''}`}>
      {/* <div className={`courtain ${isLandingComplete ? 'on' : ''}`}></div> */}
      <svg width="0" height="0" viewBox="0 0 900 450">
        <filter id="thicker">
          <feMorphology operator="dilate" radius="2" in="SourceGraphic" />
        </filter>
        <filter id="outliner">
          <feMorphology
            operator="dilate"
            radius="2"
            in="SourceGraphic"
            result="outline"
          />
          <feComposite operator="out" in="outline" in2="SourceGraphic" />
        </filter>
      </svg>

      <div className="col">
        <p
          className="filter-pseudo"
          data-text="백진혁 포트폴리오입니다"
          ref={textRef}
        >
          백진혁 포트폴리오입니다
          <span className="dot-container">
            <svg
              className={`dot-svg ${isDotTransformed ? 'dot-transformed' : ''}`}
              width={`${textHeight }px`}
              height={`${textHeight}px`}
              viewBox="0 0 16 16" 
              xmlns="http://www.w3.org/2000/svg"
              fill="var(--text-color)"
            >
              <circle cx="8" cy="12" r="1" className="exclamation-dot" />
              <path
                className="exclamation-line"
                d="M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"
                opacity={isDotTransformed ? 1 : 0}
              />
            </svg>
          </span>
        </p>
      </div>
    </main>
  );
}

export default LandingPage;
