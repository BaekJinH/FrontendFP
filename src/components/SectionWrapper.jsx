import React, { useState, useEffect } from 'react';
import Cursor from './Cursor';
import SectionNavigation from './SectionNavigation';
import '../styles/sectionWrapper.scss';

function SectionWrapper({ children, endLanding }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    if (endLanding) {
      const timer = setTimeout(() => {
        setIsSectionVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [endLanding]);

  const handleScroll = (event) => {
    if (React.Children.toArray(children)[activeIndex].type.name === 'MainRowWheel') {
      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;
    setActiveIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      newIndex = Math.max(0, Math.min(React.Children.count(children) - 1, newIndex));
      return newIndex;
    });
  };

  const handleScrollBoundary = (direction) => {
    setActiveIndex((prevIndex) => {
      let newIndex = direction === 'up' ? prevIndex - 1 : prevIndex + 1;
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
            {React.cloneElement(child, { onScrollBoundary: handleScrollBoundary })}
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
