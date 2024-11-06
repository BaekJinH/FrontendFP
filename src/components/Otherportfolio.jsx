import React, { useEffect, useState } from 'react';
import '../styles/otherSection.scss';

function OtherSection() {
  const [lis, setLis] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [nextIndex, setNextIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredTextIndex, setHoveredTextIndex] = useState(null);
  const [typedText, setTypedText] = useState(''); // 타이핑 애니메이션 텍스트

  useEffect(() => {
    fetch(`./data/puborReact.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // 작업물 이름 설정
        const updatedData = data.map((item, index) => ({
          ...item,
          name: `${index + 1}번 작업물`
        }));
        setLis(updatedData);
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
  }, []);

  const handleSelect = (index) => {
    if (index !== activeIndex && !isAnimating) {
      setIsAnimating(true);

      const newDirection = index > activeIndex ? 'next' : 'prev';
      setDirection(newDirection);

      setAnimationClass('move-out-next');
      setNextIndex(index);

      setTimeout(() => {
        setActiveIndex(index);
        setAnimationClass('');
        setNextIndex(null);
        setIsAnimating(false);
      }, 700);
    }
  };

  // 타이핑 애니메이션 효과
  useEffect(() => {
    let typingTimeout;
    if (hoveredTextIndex !== null) {
      setTypedText(''); // 초기화
      const fullText = lis[hoveredTextIndex]?.text || '';

      let currentIndex = 0;
      typingTimeout = setInterval(() => {
        setTypedText((prev) => prev + fullText[currentIndex]);
        currentIndex += 1;
        if (currentIndex === fullText.length) clearInterval(typingTimeout);
      }, 50); // 타이핑 속도 조절 (50ms)
    }

    return () => clearInterval(typingTimeout); // cleanup
  }, [hoveredTextIndex, lis]);

  return (
    <section className="publish_react-section" id='Otherportfolio'>
      <section className="section-inner">
        <div className="view-box-container">
          {lis.map((li, index) => (
            <div
              key={index}
              className={`view-box ${index === activeIndex ? 'active' : ''} ${
                direction === 'next' && index === activeIndex ? animationClass : ''
              } ${index === nextIndex && direction === 'next' ? 'next-active' : ''}`}
            >
              <a href={li.link} target="_blank" rel="noopener noreferrer">
                <div className="content">
                  <h3>{li.title}</h3>
                  <p>{li.content}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="navigation-buttons">
          <ul>
            {lis.map((li, index) => (
              <li
                key={index}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredTextIndex(index)}
                onMouseLeave={() => {
                  setHoveredTextIndex(null);
                  setTypedText(''); // 타이핑 초기화
                }}
                className={index === activeIndex ? 'active' : ''}
              >
                <a href="#none">
                  {hoveredTextIndex === index ? typedText : li.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}

export default OtherSection;
