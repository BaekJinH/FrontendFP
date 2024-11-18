import React, { useState, useEffect } from 'react';
import "./styles/setting/fonts.scss";
import "./styles/setting/var.scss";
import "./styles/setting/default.scss";

import LandingPage from './components/LandingPage';
import FirstSection from './components/FisrtSection';
import SectionWrapper from './components/SectionWrapper';
import BubbleSection from './components/BubbleSection';
import Otherportfolio from './components/Otherportfolio';
import EndSection from './components/EndSection';
import Spaceword from './components/Spaceword.jsx';
import VanillaSection from './components/VanillaSection';
import MenuSec from './components/Menu_sec';
import Board from './components/Board';
import Dashboard from './components/Dashboard';
import ChatTodoApp from './components/ChatTodoApp';
import MainRowWheel from './components/MainRowWheel';

function App() {
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [endLanding, setEndLanding] = useState(false);

  const handleLandingComplete = () => {
    setEndLanding(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLandingVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      {isLandingVisible ? (
        <LandingPage onLandingComplete={handleLandingComplete} />
      ) : (
        <>
          <SectionWrapper endLanding={endLanding}>
            <Spaceword id="Spaceword" />
            <FirstSection id="FirstSection" />
            <BubbleSection id="BubbleSection" />
            <MainRowWheel id="MainRowWheel" />
            <Otherportfolio id="Otherportfolio" />
            <VanillaSection id="VanillaSection" />
            <EndSection id="EndSection" />
          </SectionWrapper>
          <MenuSec />
        </>
      )}
    </div>
  );
}

export default App;