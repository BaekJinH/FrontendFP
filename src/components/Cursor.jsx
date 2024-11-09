import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/cursor.scss';

const Cursor = () => {
  const cursorRef = useRef(null);
  const amount = 25;
  const sineDots = Math.floor(amount * 0.3);
  const width = 26;
  const idleTimeout = 150;
  let lastFrame = 0;
  let mousePosition = { x: 0, y: 0 };
  let dots = [];
  let timeoutID;
  let idle = false;

  useEffect(() => {
    const cursor = cursorRef.current;
    const onMouseMove = (event) => {
      mousePosition.x = event.clientX - width / 2;
      mousePosition.y = event.clientY - width / 2;
      resetIdleTimer();
    };

    const onTouchMove = (event) => {
      mousePosition.x = event.touches[0].clientX - width / 2;
      mousePosition.y = event.touches[0].clientY - width / 2;
      resetIdleTimer();
    };

    const startIdleTimer = () => {
      timeoutID = setTimeout(goInactive, idleTimeout);
      idle = false;
    };

    const resetIdleTimer = () => {
      clearTimeout(timeoutID);
      startIdleTimer();
    };

    const goInactive = () => {
      idle = true;
      for (let dot of dots) {
        dot.lock();
      }
    };

    const buildDots = () => {
      for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
      }
    };

    class Dot {
      constructor(index = 0) {
        this.index = index;
        this.anglespeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = 1 - 0.05 * index;
        this.range = width / 2 - (width / 2) * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement('span');
        gsap.set(this.element, { scale: this.scale });
        cursor.appendChild(this.element);
      }

      lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
      }

      draw(delta) {
        if (!idle || this.index <= sineDots) {
          gsap.set(this.element, { x: this.x, y: this.y });
        } else {
          this.angleX += this.anglespeed;
          this.angleY += this.anglespeed;
          this.y = this.lockY + Math.sin(this.angleY) * this.range;
          this.x = this.lockX + Math.sin(this.angleX) * this.range;
          gsap.set(this.element, { x: this.x, y: this.y });
        }
      }
    }

    const render = (timestamp) => {
      const delta = timestamp - lastFrame;
      positionCursor(delta);
      lastFrame = timestamp;
      requestAnimationFrame(render);
    };

    const positionCursor = (delta) => {
      let x = mousePosition.x;
      let y = mousePosition.y;
      dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
          const dx = (nextDot.x - dot.x) * 0.5;
          const dy = (nextDot.y - dot.y) * 0.5;
          x += dx;
          y += dy;
        }
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    buildDots();
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return <div id="cursor" className="Cursor" ref={cursorRef}></div>;
};

export default Cursor;