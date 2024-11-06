import React from 'react';
import '../styles/sectionNavigation.scss';

function SectionNavigation({ sections, activeIndex, onDotClick }) {
  return (
    <div className="section-navigation">
      {sections.map((_, index) => (
        <div
          key={index}
          className={`dot ${index === activeIndex ? 'active' : ''}`}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  );
}

export default SectionNavigation;
