// EndSection.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../styles/EndSection.scss';

function EndSection() {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showEraseLine, setShowEraseLine] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const endSectionRef = useRef(null);
  const timeouts = useRef([]);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const links = useRef([]);

  const sectionNames = ['1번 페이지', '2번 페이지', '3번 페이지', '4번 페이지'];

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
    }, 5000);

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

  return (
    <section className="end-page" ref={endSectionRef} id='EndSection'>
      <ul className="person-info">
        <li className="endpage-navi">
          <div className="circle-nav">
            {['#FirstSection', '#BubbleSection', '#Otherportfolio', '#EndSection'].map((sectionId, index) => (
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
                      <circle cx="50" cy="50" r="40" fill="#fff" />
                      <text x="50" y="55" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                        {sectionNames[index]}
                      </text>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </li>
        <li>
          <a href="mailto:wlsgur_bloom@naver.com">wlsgur_bloom@naver.com</a>
        </li>
        <li>
          <a href="tel:010-8681-6741">010-8681-6741</a>
        </li>
      </ul>
      <div className="end-messages">
        {showFirstMessage && (
          <div className="message-container">
            <h1 className="message">이상입니다.</h1>
            {showEraseLine && <div className="erase-line"></div>}
          </div>
        )}
        {showSecondMessage && <h1 className="message">감사합니다.</h1>}
      </div>
    </section>
  );
}

export default React.memo(EndSection);
