import React, { useState, useEffect } from 'react';

function DataFetchBubble() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="bubble">
      <h3>Data Fetch</h3>
      {data ? <p>{data.title}</p> : <p>Loading...</p>}
    </div>
  );
}

import React, { useContext, createContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeBubble() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={`bubble ${theme}`}>
      <h3>Theme</h3>
      <p>Current Theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}

import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function ReducerBubble() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="bubble">
      <h3>Reducer</h3>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}

import React, { useRef } from 'react';

function FocusInputBubble() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bubble">
      <h3>Focus Input</h3>
      <input ref={inputRef} type="text" placeholder="Click the button to focus" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

import React, { useState, useMemo } from 'react';

function ExpensiveCalculationBubble() {
  const [count, setCount] = useState(0);

  const expensiveCalculation = (num) => {
    console.log('Calculating...');
    for (let i = 0; i < 1000000000; i++) {} 
    return num * 2;
  };

  const result = useMemo(() => expensiveCalculation(count), [count]);

  return (
    <div className="bubble">
      <h3>Expensive Calculation</h3>
      <p>Result: {result}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}


import React, { useState, useLayoutEffect, useRef } from 'react';

function LayoutEffectBubble() {
  const [height, setHeight] = useState(0);
  const divRef = useRef(null);

  useLayoutEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div className="bubble" ref={divRef}>
      <h3>Layout Effect</h3>
      <p>The height of this div is: {height}px</p>
    </div>
  );
}

import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} type="text" />;
});

function ImperativeHandleBubble() {
  const inputRef = useRef();

  return (
    <div className="bubble">
      <h3>Imperative Handle</h3>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </div>
  );
}