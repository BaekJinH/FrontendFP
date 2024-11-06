import React, { useEffect, useState, useRef } from 'react';
import '../styles/firstSection.scss';

function FirstSection() {
  const [colors, setColors] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [typingText, setTypingText] = useState(['', '']); // 타이핑 텍스트
  const sectionRef = useRef(null);
  const typingIntervals = useRef([]); // 타이핑 애니메이션을 관리하는 배열

  const generateRandomBrightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 100;
    const lightness = 80 + Math.random() * 20;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    const generatedColors = Array.from({ length: 4 }, () => generateRandomBrightColor());
    setColors(generatedColors);
  }, []);

  const clearTypingIntervals = () => {
    typingIntervals.current.forEach((interval) => clearInterval(interval));
    typingIntervals.current = [];
  };

  useEffect(() => {
    let interval;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleIndex(-1);
            setTypingText(['', '']); // 타이핑 텍스트 초기화
            clearTypingIntervals();
            interval = setInterval(() => {
              setVisibleIndex((prevIndex) => (prevIndex < 3 ? prevIndex + 1 : 3));
            }, 500);
          } else {
            setVisibleIndex(-1);
            setTypingText(['', '']); // 타이핑 텍스트 초기화
            clearTypingIntervals();
            clearInterval(interval); // hashtag 애니메이션 중지
          }
        });
      },
      { threshold: 0.7 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      clearTypingIntervals();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (visibleIndex === 3) {
      const texts = [
        '새로운 것을 만드는, 화려한 페이지를 만드는, 최적화에 관심이 있는 개발자 입니다.',
        '이력서 링크'
      ];

      texts.forEach((text, i) => {
        let charIndex = 0;
        const typingInterval = setInterval(() => {
          setTypingText((prevTypingText) => {
            const updatedText = [...prevTypingText];
            updatedText[i] += text[charIndex];
            return updatedText;
          });
          charIndex += 1;
          if (charIndex === text.length) clearInterval(typingInterval);
        }, 50); // 타이핑 속도 조절
        typingIntervals.current.push(typingInterval);
      });
    }
  }, [visibleIndex]);

  return (
    <div className="first-section" ref={sectionRef}>
      <section className="profile-section" id='FirstSection'>
        <div className="image-container">
          <div className="image-wrapper">
            <img src="/image/FirstView.jpg" alt="Example" className="responsive-image" />
          </div>
          <div className="text-box">
            <ul>
              <li className="hashtag">
                {['퍼블리셔', '신입 프론트엔드', '예시2', '예시3'].map((text, index) => (
                  <p
                    key={index}
                    style={{
                      opacity: visibleIndex >= index ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out',
                      color: '#FFFFFF'
                    }}
                  >
                    <b style={{ color: colors[index] }}>#</b> {text}
                  </p>
                ))}
              </li>
              <li style={{ opacity: visibleIndex === 3 ? 1 : 0 }}>{typingText[0]}</li>
              <li style={{ opacity: visibleIndex === 3 ? 1 : 0 }}>
                <a
                  href="https://likeable-palladium-d6b.notion.site/115296ec05af800e81e4c435054dd918?pvs=4"
                  className="resume-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {typingText[1] || '이력서 링크'}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FirstSection;
