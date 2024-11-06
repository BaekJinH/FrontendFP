import React, { useEffect, useRef, useState } from 'react';
import '../styles/testSection.scss';

function TestSection() {
  const [bubbles, setBubbles] = useState([]);
  const spaceRefs = useRef([]);
  const sectionInnerRef = useRef(null);
  let time = 0;
  let mouseX = window.innerWidth * 0.75;
  let x = 0;

  const opt = {
    radius: 300,
    radiusY: 0.4,
    maxSpeed: 0.01,
    maxRotation: 20,
    minOpacity: 0.3,
  };

  useEffect(() => {
    fetch(`/data/bubbleData.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBubbles(data);
      })
      .catch(error => {
        console.error('Error fetching the bubble data:', error);
      });
  }, []);

  useEffect(() => {
    const handleMouse = e => {
      mouseX = e.pageX; // pageX로 절대적인 화면 위치값을 받아와서 사용합니다.
      // console.log('Mouse X:', mouseX); // 제대로 들어오는지 콘솔에서 확인
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchstart', handleMouse);
    window.addEventListener('touchmove', handleMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchstart', handleMouse);
      window.removeEventListener('touchmove', handleMouse);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!spaceRefs.current.length) return;

      // lerp로 스무스하게 mouseX에 따라 애니메이션 변경
      x = lerp(x, mouseX / window.innerWidth, 0.1);
      const rotation = -opt.maxRotation + x * opt.maxRotation * 2;
      const speed = -opt.maxSpeed + x * opt.maxSpeed * 2;
      const modY = 1 + x * -2;

      time -= speed;

      spaceRefs.current.forEach((space, ind) => {
        const theta = 1 - ind / spaceRefs.current.length;
        const x = opt.radius * Math.sin(time + theta * Math.PI * 2);
        const y = opt.radius * opt.radiusY * Math.cos(modY + time + theta * Math.PI * 2);
        const s = scale(y, -opt.radius * opt.radiusY, opt.radius * opt.radiusY, opt.minOpacity, 1);

        Object.assign(space.style, {
          zIndex: Math.min(2, Math.max(-2, Math.ceil(y))),
          filter: `blur(${4 - 5 * s}px)`,
          opacity: s,
          transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) translate(-50%, -50%)`,
        });
      });

      requestAnimationFrame(animate);
    };
    animate();
  }, [bubbles]);

  const scale = (a, b, c, d, e) => {
    return (a - b) * (e - d) / (c - b) + d;
  };

  const lerp = (v0, v1, t) => {
    return v0 * (1 - t) + v1 * t;
  };

  return (
    <section className="space-section" id="TestSection">
      <section className="section-inner" ref={sectionInnerRef}>
        <div className="planet"></div>
        {bubbles.map((bubble, index) => (
          <div
            key={bubble.id}
            className="space"
            ref={el => (spaceRefs.current[index] = el)}
          >
            <img
              className="space-image-background"
              src={bubble.image}
              alt={bubble.content}
            />
            <div className="image-outer-wrap">
              <img
                className="space-image"
                src={bubble.image}
                alt={bubble.content}
              />
            </div>
            <div className="preview">{bubble.content}</div>
          </div>
        ))}
      </section>
    </section>
  );
}

export default TestSection;
