import React, { useEffect, useRef, useState } from 'react';
import '../styles/bubbleSection.scss';

function BubbleSection() {
  const [bubbles, setBubbles] = useState([]);
  const [clickedBubbleIndex, setClickedBubbleIndex] = useState(null); // 클릭된 버블 인덱스 저장
  const [showCloseButton, setShowCloseButton] = useState(false); // 닫기 버튼 표시 여부
  const [displayText, setDisplayText] = useState(''); // 한 글자씩 표시될 텍스트
  const bubbleRefs = useRef([]);
  const sectionInnerRef = useRef(null);
  const timeoutsRef = useRef([]);
  const textIndexRef = useRef(0); // 타이핑 애니메이션 글자 인덱스 관리
  const typingIntervalRef = useRef(null); // 타이핑 애니메이션 인터벌 참조

  useEffect(() => {
    fetch(`${window.location.origin}/FrontendFP/data/bubbleData.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBubbles(data);
        resetBubbles();
      })
      .catch(error => {
        console.error('Error fetching the bubble data:', error);
      });
  }, []);

  const resetBubbles = () => {
    if (!sectionInnerRef.current) return;

    const sectionBounds = sectionInnerRef.current.getBoundingClientRect();
    const minimumGap = 70;

    bubbleRefs.current.forEach((bubble, index) => {
      if (bubble) {
        let isOverlapping = true;
        let x, y, size;

        while (isOverlapping) {
          isOverlapping = false;
          size = Math.random() * (310 - 180) + 180;
          x = Math.random() * (sectionBounds.width - size);
          y = Math.random() * (sectionBounds.height - size);

          for (let i = 0; i < index; i++) {
            const otherBubble = bubbleRefs.current[i];
            if (otherBubble) {
              const distance = calculateDistance(x, y, otherBubble);
              if (distance < size + minimumGap) {
                isOverlapping = true;
                break;
              }
            }
          }
        }

        bubble.style.transform = `translate(${x}px, ${y}px)`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
      }
    });

    startBubbleAnimations();
  };

  const startBubbleAnimations = () => {
    bubbleRefs.current.forEach(bubble => {
      if (bubble) {
        moveBubble(bubble);
      }
    });
  };

  useEffect(() => {
    if (!sectionInnerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bubbleRefs.current.forEach(bubble => {
              if (bubble) {
                bubble.style.transition = 'transform 3s ease-in-out';
                moveBubble(bubble);
              }
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    bubbleRefs.current.forEach(bubble => {
      if (bubble) observer.observe(bubble);
    });

    return () => observer.disconnect();
  }, [bubbles]);

  const moveBubble = bubble => {
    if (!bubble || bubble.classList.contains('active-bubble')) return;

    let xMovement = Math.random() * 20 - 10;
    let yMovement = Math.random() * 20 - 10;

    const currentTransform = bubble.style.transform.match(/-?\d+(\.\d+)?/g);
    const currentX = currentTransform ? parseFloat(currentTransform[0]) : 0;
    const currentY = currentTransform ? parseFloat(currentTransform[1]) : 0;

    let newX = currentX + xMovement;
    let newY = currentY + yMovement;

    const bubbleSize = bubble.offsetWidth;
    const maxWidth =
      sectionInnerRef.current.getBoundingClientRect().width - bubbleSize;
    const maxHeight =
      sectionInnerRef.current.getBoundingClientRect().height - bubbleSize;

    if (newX < 0) newX = 0;
    if (newX > maxWidth) newX = maxWidth;
    if (newY < 0) newY = 0;
    if (newY > maxHeight) newY = maxHeight;

    bubble.style.transform = `translate(${newX}px, ${newY}px)`;

    const timeoutId = setTimeout(() => moveBubble(bubble), 3000);
    timeoutsRef.current.push(timeoutId);
  };

  const burstBubble = index => {
    if (clickedBubbleIndex !== null) return;
    const bubble = bubbleRefs.current[index];
    if (bubble) {
      const sectionBounds = sectionInnerRef.current.getBoundingClientRect();
      const bubbleBounds = bubble.getBoundingClientRect();

      const centerX = sectionBounds.width / 2 - bubbleBounds.width / 2;
      const centerY = sectionBounds.height / 2 - bubbleBounds.height / 2;

      bubble.style.transition =
        'transform 0.5s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out';
      bubble.style.transform = `opacity(1)`; 
      bubble.style.zIndex = '1';
      bubble.style.transform = `translate(${centerX}px, ${centerY}px) scale(1.5)`;
      bubble.style.background = `rgba(255, 255, 255, 1)`;

      setTimeout(() => {
        bubble.style.width = `100%`;
        bubble.style.height = `100%`;
        bubble.style.borderRadius = `0`;
        bubble.style.zIndex = '1';
        bubble.style.transform = `scale(1)`;
        bubble.style.background = `rgba(0, 0, 0, 1)`;
        bubble.classList.add('border-bubble');
        setTimeout(()=> {
          startTypingAnimation(bubbles[index].innerContent); // 타이핑 애니메이션 시작
        }, 1000 )
      }, 1500);

      setTimeout(() => {
        setShowCloseButton(true);
      }, 2500);

      setClickedBubbleIndex(index);
    }
  };

  const startTypingAnimation = (textArray) => {
    setDisplayText(''); // 기존 텍스트 초기화
    textIndexRef.current = 0;

    // 기존 타이핑 애니메이션 인터벌이 있다면 제거
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    let currentText = textArray.join(''); // 모든 문장을 하나의 문자열로 결합

    typingIntervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + currentText[textIndexRef.current]);
      textIndexRef.current += 1;
      if (textIndexRef.current === currentText.length) {
        clearInterval(typingIntervalRef.current);
        // 타이핑이 끝난 후에도 텍스트가 유지되도록 함
      }
    }, 10); // 각 글자가 나타나는 간격 (100ms)
  };

  const stopBubbleAnimations = () => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const closeFullscreenBubble = () => {
    // 닫기 버튼 누르면 텍스트 즉시 지우기
    setDisplayText('');
    
    const bubble = bubbleRefs.current[clickedBubbleIndex];
    if (bubble) {
      const sectionBounds = sectionInnerRef.current.getBoundingClientRect();
      const bubbleBounds = bubble.getBoundingClientRect();

      const centerX = sectionBounds.width / 2 - bubbleBounds.width / 2;
      const centerY =
        sectionInnerRef.current.scrollTop +
        (sectionBounds.height / 2 - bubbleBounds.height / 2);

      bubble.style.transition =
        'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
      bubble.style.transform = `translate(${centerX}px, ${centerY}px) scale(0.1)`;
      bubble.style.opacity = '0';

      stopBubbleAnimations();

      // 타이핑 인터벌 제거
      clearInterval(typingIntervalRef.current);

      setTimeout(() => {
        bubbleRefs.current.forEach((b, idx) => {
          if (b) {
            b.style.transition = 'none';
            if (idx !== clickedBubbleIndex) {
              b.style.transform = '';
            }
          }
        });

        resetBubbles();

        setTimeout(() => {
          bubbleRefs.current.forEach(b => {
            if (b) b.style.transition = 'transform 3s ease-in-out';
          });

          bubble.style.transition = 'transform 3s ease-in-out';
          bubble.style.width = bubble.dataset.originalWidth || '150px';
          bubble.style.height = bubble.dataset.originalHeight || '150px';
          bubble.style.background = `rgba(255, 255, 255, .6)`;
          bubble.style.borderRadius = `50%`;
          bubble.style.zIndex = '0';
          bubble.style.opacity = '1';

          setClickedBubbleIndex(null);

          setTimeout(() => startBubbleAnimations(), 500);
        }, 0);
      }, 500);
      setShowCloseButton(false);
    }
  };

  const calculateDistance = (x, y, otherBubble) => {
    const otherBounds = otherBubble.getBoundingClientRect();
    const otherX = parseFloat(
      otherBounds.left - sectionInnerRef.current.getBoundingClientRect().left
    );
    const otherY = parseFloat(
      otherBounds.top - sectionInnerRef.current.getBoundingClientRect().top
    );
    return Math.sqrt(Math.pow(x - otherX, 2) + Math.pow(y - otherY, 2));
  };

  return (
    <section className="bubble-section" id='BubbleSection'>
      <section className="section-inner" ref={sectionInnerRef}>
        {bubbles.map((bubble, index) => (
          <a
            key={bubble.id}
            href="#none"
            className={`bubble ${
              clickedBubbleIndex === index
                ? 'expanded active-bubble'
                : clickedBubbleIndex !== null
                ? 'blurred' // 클릭된 버블이 있을 때 나머지 버블을 흐리게
                : ''
            }`}
            ref={el => (bubbleRefs.current[index] = el)}
            onClick={() => burstBubble(index)}
          >
            <img 
              className='bubble-image-background'
              src={bubble.image}
              alt={bubble.content}
            />
            <div className='image-outer-wrap'>
              <img
                className="bubble-image"
                src={bubble.image}
                alt={bubble.content}
              />
            </div>
            <div className="preview">{bubble.content}</div>

            {clickedBubbleIndex === index && (
              <div
                className="inner-content"
                dangerouslySetInnerHTML={{ __html: displayText }}
              />
            )}

            <span className="border-span top-left"></span>
            <span className="border-span top-right"></span>
            <span className="border-span bottom-left"></span>
            <span className="border-span bottom-right"></span>
          </a>
        ))}
        {showCloseButton && clickedBubbleIndex !== null && (
          <a className="close-button" onClick={closeFullscreenBubble}>
            <svg
              fill="#fff"
              height="30px"
              width="30px"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1082.2,896.6l410.2-410c51.5-51.5,51.5-134.6,0-186.1s-134.6-51.5-186.1,0l-410.2,410L486,300.4c-51.5-51.5-134.6-51.5-186.1,0s-51.5,134.6,0,186.1l410.2,410l-410.2,410c-51.5,51.5-51.5,134.6,0,186.1c51.6,51.5,135,51.5,186.1,0l410.2-410l410.2,410c51.5,51.5,134.6,51.5,186.1,0c51.1-51.5,51.1-134.6-0.5-186.2L1082.2,896.6z" />
            </svg>
          </a>
        )}
      </section>
    </section>
  );
}

export default BubbleSection;
