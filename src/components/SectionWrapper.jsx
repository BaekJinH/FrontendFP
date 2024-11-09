import React, { useState, useEffect } from 'react';
import Cursor from './Cursor';
import SectionNavigation from './SectionNavigation';
import '../styles/sectionWrapper.scss';

function SectionWrapper({ children, endLanding }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false); // 트랜지션 제어

  useEffect(() => {
    if (endLanding) {
      // 랜딩 후 약간의 지연을 주어 트랜지션 효과를 적용
      const timer = setTimeout(() => {
        setIsSectionVisible(true);
      }, 100); // 트랜지션 딜레이 (100ms 정도)

      return () => clearTimeout(timer);
    }
  }, [endLanding]);

  const handleScroll = (event) => {
    const direction = event.deltaY > 0 ? 1 : -1;
    setActiveIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      newIndex = Math.max(0, Math.min(React.Children.count(children) - 1, newIndex));
      return newIndex;
    });
  };

  return (
    <div className="section-wrapper" onWheel={handleScroll}>
      <Cursor />
      <div
        className={`sections ${isSectionVisible ? "view-section" : ""}`}
        style={{ transform: `translateY(-${activeIndex * 100}vh)` }}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className="section">
            {child}
          </div>
        ))}
      </div>
      <SectionNavigation
        sections={React.Children.toArray(children)}
        activeIndex={activeIndex}
        onDotClick={setActiveIndex}
      />
      <div className="mouse"></div>
    </div>
  );
}

export default SectionWrapper;
