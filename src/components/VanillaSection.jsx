import React, { useEffect, useState, useRef } from 'react';
import '../styles/vanillaSection.scss';

function VanillaSection() {
  const [skills, setSkills] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    fetch(`data/vanilla.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSkills(data);
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPaused) {
            startInterval();
          } else {
            clearInterval(intervalRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [skills, isPaused]);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
      startProgressBar();
    }, 3000);

    startProgressBar();
  };

  const startProgressBar = () => {
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '1%';

      void progressRef.current.offsetWidth;

      progressRef.current.style.transition = 'width 4000ms linear';
      progressRef.current.style.width = '100%';
    }
  };

  const handleStop = () => {
    if (isPaused) {
      setIsPaused(false);
      startInterval();
    } else {
      setIsPaused(true);
      clearInterval(intervalRef.current);
      resetProgressBar();
    }
  };

  const resetProgressBar = () => {
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '1%';
    }
  };

  return (
    <section className="vanilla_react-section" id="vanilla" ref={sectionRef}>
      <section className="section-inner skill_built">
        {skills.map((li, index) => (
          <div
            key={li.id}
            className={`skill-item ${index === currentIndex ? 'visible' : 'hidden'}`}
          >
            <div className="img-box">
              <img src={li.image} alt={`Skill ${li.id}`} />
            </div>
            <div className="comment-box">
              <span>{li.built}</span>
              <p dangerouslySetInnerHTML={{ __html: li.comment }}></p>
            </div>
          </div>
        ))}
        <div className="progress-box">
          <button onClick={handleStop}>{isPaused ? '재시작' : '멈추기'}</button>
          <div className="progress-bar" ref={progressRef}></div>
        </div>
      </section>
    </section>
  );
}

export default VanillaSection;
