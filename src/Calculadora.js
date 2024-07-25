import React, { useState } from 'react';
import './Calculadora.css';

const Calculadora = () => {
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light');
  const [cursorPosition, setCursorPosition] = useState(null);

  const handleClick = (value) => {
    const lastChar = input.slice(-1);
    const newInput = input + value;

    // Evitar más de un punto decimal en un segmento de número
    if (value === '.' && lastChar === '.') {
      window.alert('Syntax Error');
      return;
    }

    // Evitar dos operadores consecutivos
    if (['/', '*', '+', '-'].includes(value) && ['/', '*', '+', '-'].includes(lastChar)) {
      window.alert('Syntax Error');
      return;
    }

    setInput(newInput);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleClearInput = () => {
    setInput(input.slice(0, -1)); // Elimina el último carácter del input
  };

  const handleCalculate = () => {
    try {
      // Eliminar ceros iniciales de los números
      const sanitizedInput = input.replace(/\b0+(\d)/g, '$1');

      // Verificar división por cero
      if (sanitizedInput.includes('/0') && !sanitizedInput.includes('/0.')) {
        window.alert('Error: No se puede dividir para 0');
        setInput('');
        return;
      }

      let evaluatedResult = eval(sanitizedInput); // eval puede ser peligroso, usa una alternativa más segura en producción

      // Limitar el resultado a 6 dígitos totales
      if (typeof evaluatedResult === 'number') {
        const [integerPart, decimalPart] = evaluatedResult.toString().split('.');
        if (integerPart.length >= 6) {
          evaluatedResult = integerPart.slice(0, 6);
        } else if (decimalPart) {
          evaluatedResult = parseFloat(evaluatedResult.toFixed(6 - integerPart.length));
        }
      }

      setInput(evaluatedResult.toString());
    } catch (error) {
      window.alert('Syntax Error');
      setInput('');
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Validar que solo se ingresen números, operadores y el punto decimal
    if (/^[0-9+\-*/.]*$/.test(newValue)) {
      setInput(newValue);
    } else {
      window.alert('Syntax Error');
    }
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    const validKeys = '0123456789/*+-=.';
    const lastChar = input.slice(-1);

    // Validar que solo se ingresen caracteres válidos
    if (!validKeys.includes(key) && key !== 'Backspace' && key !== 'Enter' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      e.preventDefault();
      window.alert('Syntax Error');
      return;
    }

    // Evitar dos operadores consecutivos
    if (['/', '*', '+', '-'].includes(key) && ['/', '*', '+', '-'].includes(lastChar)) {
      e.preventDefault();
      window.alert('Syntax Error');
      return;
    }

    // Si se presiona Enter, realizar el cálculo
    if (key === 'Enter') {
      e.preventDefault();
      handleCalculate();
      return;
    }

    // Mover el cursor con las teclas de flecha
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const cursorPos = e.target.selectionStart;
      setCursorPosition(cursorPos);
    }
  };

  const handleFocus = (e) => {
    if (cursorPosition !== null) {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`calculator-container ${theme}`}>
      <div className="calculadora">
        <div className="display">
          <input 
            type="text" 
            value={input} 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className={theme === 'dark' ? 'dark-input' : ''}
          />
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
