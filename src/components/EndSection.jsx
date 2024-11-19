import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../styles/EndSection.scss';

function EndSection() {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showEraseLine, setShowEraseLine] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const endSectionRef = useRef(null);
  const timeouts = useRef([]);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const links = useRef([]);

  const sectionNames = ['', '', '', ''];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isAnimationRunning && !isAnimationComplete) {
          startAnimation();
        } else if (!entry.isIntersecting) {
          resetAnimation();
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    if (endSectionRef.current) {
      observer.observe(endSectionRef.current);
    }

    return () => {
      if (endSectionRef.current) {
        observer.unobserve(endSectionRef.current);
      }
      clearAllTimeouts();
    };
  }, [isAnimationRunning, isAnimationComplete]);

  const scrollToSection = useCallback((event, sectionId) => {
    event.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const startAnimation = useCallback(() => {
    setIsAnimationRunning(true);
    setShowFirstMessage(true);

    const firstTimeout = setTimeout(() => {
      setShowEraseLine(true);
    }, 3000);

    const secondTimeout = setTimeout(() => {
      setShowFirstMessage(false);
      setShowEraseLine(false);
      setShowSecondMessage(true);
    }, 7000);

    const thirdTimeout = setTimeout(() => {
      setIsAnimationRunning(false);
      setIsAnimationComplete(true);
    }, 7000);

    timeouts.current.push(firstTimeout, secondTimeout, thirdTimeout);
  }, []);

  const resetAnimation = useCallback(() => {
    clearAllTimeouts();
    setIsAnimationRunning(false);
    setIsAnimationComplete(false);
    setShowFirstMessage(false);
    setShowEraseLine(false);
    setShowSecondMessage(false);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeouts.current.forEach((timeout) => clearTimeout(timeout));
    timeouts.current = [];
  }, []);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentLinkIndex((prevIndex) => (prevIndex + 1) % links.current.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isHovering]);

  const handleLinkHover = useCallback((index) => {
    setIsHovering(true);
    setCurrentLinkIndex(index);
  }, []);

  const handleLinkLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    button.classList.add('fly');
    setTimeout(() => {
      button.classList.remove('fly');
    }, 5400);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        setMessage('피드백이 성공적으로 저장되었습니다.');
        setFeedback('');
      } else {
        setMessage('피드백 저장에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 오류가 발생했습니다.');
      console.error(process.env.REACT_APP_API_URL)
    }
  };

  return (
    <section className="end-page" ref={endSectionRef} id='EndSection'>
      <ul className="person-info">
        <li className="endpage-navi">
          {/* <div className="circle-nav">
            {['첫 페이지', '소개 페이지', '코드 페이지', '퍼블리셔 작업'].map((sectionId, index) => (
              <a
                key={sectionId}
                href={sectionId}
                className={`circle-link ${currentLinkIndex === index ? 'current' : ''}`}
                onClick={(e) => scrollToSection(e, sectionId)}
                onMouseEnter={() => handleLinkHover(index)}
                onMouseLeave={handleLinkLeave}
                ref={(el) => (links.current[index] = el)}
              >
                <div className="circle">
                  {sectionId.replace('#', '')}
                  <div className="outer-circle">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div> */}
        </li>
      </ul>
      <div className="end-messages">
        {showFirstMessage && (
          <div className="message-container">
            <h1 className="message">이상입니다.</h1>
            {showEraseLine && <div className="erase-line"></div>}
            {showEraseLine && <div className="white-bar"></div>}
          </div>
        )}
        {showSecondMessage && <h1 className="message">감사합니다.</h1>}
      </div>
      <div className="feedback-container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="피드백을 입력해주세요!!"
            required
          />
          <button className="mail-btn" type="submit">제출</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
}

export default React.memo(EndSection);