import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/menu.scss';

function Menu() {
  const dotRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const handleMouseEnter = (e) => {
    const target = e.currentTarget.querySelector('.bg');
    gsap.fromTo(target, { x: '-112%' }, { x: '-12%', duration: 0.65, ease: 'power3.out' });
  };

  const handleMouseLeave = (e) => {
    const target = e.currentTarget.querySelector('.bg');
    gsap.to(target, { x: '100%', duration: 0.65, ease: 'power3.out' });
  };

  const handleVwMenuClick = () => {
    setMenuVisible(true);
    setBubbleVisible(true);
  };

  const handleCircleMenuClick = (e) => {
    e.stopPropagation();
  };

  const handleMenuContainerClick = () => {
    setMenuVisible(false);
    setBubbleVisible(false);
  };

  return (
    <div className="menu">
      <a
        className={`vw-menu ${menuVisible ? 'hidden' : 'visible'}`}
        href="#none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleVwMenuClick}
      >
        <svg
          width="60px"
          height="60px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          className="bi bi-exclamation"
        >
          <path
            className="exclamation-dot"
            d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"
            ref={dotRef}
          />
          <path
            className="exclamation-line"
            d="M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"
          />
        </svg>
      </a>

      <div
        className={`menu-container ${menuVisible ? 'on visible' : ''}`}
        onClick={handleMenuContainerClick}
      >
        <div
          className={`inner-menu`}
          onClick={handleCircleMenuClick}
        >
          <ul className='bb-menu'>
            <li>
              <a href="mailto:wlsgur_bloom@naver.com" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="bg"></div>
                wlsgur_bloom@naver.com
              </a>
            </li>
            <li>
              <a href="tel:010-8681-6741" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="bg"></div>
                010-8681-6741
              </a>
            </li>
          </ul>
        </div>

        {bubbleVisible && (
          <div className="circle_menu pop" onClick={handleCircleMenuClick}>
            <div className="circle_menu__main"></div>
            <div className="circle_menu__drop circle_menu__drop--1"></div>
            <div className="circle_menu__drop circle_menu__drop--2"></div>
            <div className="circle_menu__drop circle_menu__drop--3"></div>
            <div className="circle_menu__drop circle_menu__drop--4"></div>
            <div className="circle_menu__drop circle_menu__drop--5"></div>
            <div className="circle_menu__drop circle_menu__drop--6"></div>
            <div className="circle_menu__drop circle_menu__drop--7"></div>
            <div className="circle_menu__drop circle_menu__drop--8"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
