// src/Calculadora.js

import React, { useState } from 'react';
import './Calculadora.css';

const Calculadora = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [theme, setTheme] = useState('light');

  const handleClick = (value) => {
    // Prevent more than one decimal point in a number segment
    if (value === '.' && input.slice(-1) === '.') return;

    // Check if the current input already has a decimal point and 10 digits after it in the current segment
    const lastNumberSegment = input.split(/[\+\-\*\/]/).pop();
    const decimalIndex = lastNumberSegment.indexOf('.');
    if (decimalIndex !== -1 && lastNumberSegment.length - decimalIndex > 10) {
      return; // Do not add more than 10 decimal digits in the current segment
    }

    // If an operator is clicked after a result is shown, start new calculation with result
    if (['/', '*', '+', '-'].includes(value) && result) {
      setInput(result + value);
      setResult('');
    } else {
      setInput(input + value);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleClearInput = () => {
    setInput(input.slice(0, -1)); // Elimina el último carácter del input
  };

  const handleCalculate = () => {
    try {
      // Check for division by zero
      if (input.includes('/0')) {
        window.alert('Error: No se puede dividir para 0');
        setInput('');
        return;
      }

      const evaluatedResult = eval(input); // eval puede ser peligroso, usa una alternativa más segura en producción

      // Convert result to string and check if it has more than 10 decimal places
      if (typeof evaluatedResult === 'number' && !Number.isInteger(evaluatedResult)) {
        setResult(evaluatedResult.toFixed(10)); // Limit to 10 decimal places
      } else {
        setResult(evaluatedResult.toString());
      }

      setInput('');
    } catch (error) {
      setResult('Error');
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`calculator-container ${theme}`}>
      <div className="calculadora">
        <div className="display">
          <input type="text" value={input} readOnly />
          <div className="result">{result}</div>
          <button className="btn clear" onClick={handleClearInput}> CE </button>
          <button className="btn clear" onClick={handleClear}> C </button>
        </div>
        <div className="buttons">
          {['9', '8', '7', '/', '6', '5', '4', '*', '3', '2', '1', '+', '.', '0', '=', '-'].map((value, index) => (
            <button
              key={index}
              className={`btn ${['/', '*', '+', '-', '='].includes(value) ? 'operator' : ''} ${value === '.' ? 'decimal' : ''}`}
              onClick={value === '=' ? handleCalculate : () => handleClick(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? 'Tema Oscuro' : 'Tema Claro'}
      </button>
    </div>
  );
};

export default Calculadora;
