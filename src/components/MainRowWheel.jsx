import React, { useState, useEffect, useRef } from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import ChatTodoApp from './ChatTodoApp';
import Dashboard from './Dashboard';
import Board from './Board';
import '../styles/mainApp.scss';

function MainRowWheel({ onScrollBoundary }) {
  const [isHorizontalScrollEnabled, setIsHorizontalScrollEnabled] = useState(true);
  const [isFirstItemFullyVisible, setIsFirstItemFullyVisible] = useState(false);
  const [isBoardFullyVisible, setIsBoardFullyVisible] = useState(false);
  const firstItemRef = useRef(null);
  const lastItemRef = useRef(null);

  useEffect(() => {
    const firstObserver = new IntersectionObserver(
      ([entry]) => {
        console.log('ChatTodoApp Visibility:', entry.isIntersecting);
        setIsFirstItemFullyVisible(entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    if (firstItemRef.current) {
      firstObserver.observe(firstItemRef.current);
    }

    return () => {
      if (firstItemRef.current) {
        firstObserver.unobserve(firstItemRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const lastObserver = new IntersectionObserver(
      ([entry]) => {
        console.log('Board Visibility:', entry.isIntersecting);
        setIsBoardFullyVisible(entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    if (lastItemRef.current) {
      lastObserver.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        lastObserver.unobserve(lastItemRef.current);
      }
    };
  }, []);

  const handleWheel = (apiObj, ev) => {
    console.log('Wheel event detected');
    const isScrollingUp = ev.deltaY < 0;

    if (isFirstItemFullyVisible && isScrollingUp) {
      console.log('Switching to the previous section');
      onScrollBoundary('up');
      return;
    }

    if (isBoardFullyVisible && !isScrollingUp) {
      console.log('Switching to the next section');
      onScrollBoundary('down');
      return;
    }

    if (isScrollingUp) {
      apiObj.scrollPrev();
    } else {
      apiObj.scrollNext();
    }
  };

  return (
    <div className="main-app">
      <ScrollMenu onWheel={handleWheel}>
        <ChatTodoApp ref={firstItemRef} />
        <Dashboard />
        <Board ref={lastItemRef} />
      </ScrollMenu>
    </div>
  );
}

export default MainRowWheel;
