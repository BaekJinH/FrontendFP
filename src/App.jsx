// App.js
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
import Menu from './components/Menu';

import TestSection from './components/TestSection.jsx';
import TestSection2 from './components/TestSection_2.jsx';

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
            <TestSection2 id="TestSection2" />
            {/* <TestSection id="TestSection" /> */}
            <FirstSection id="FirstSection" />
            <BubbleSection id="BubbleSection" />
            <Otherportfolio id="Otherportfolio" />
            <EndSection id="EndSection" />
          </SectionWrapper>
          <Menu />
        </>
      )}
    </div>
  );
}

export default App;
