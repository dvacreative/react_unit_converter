import React, { useState } from 'react';

import data from './unitconverterdata.json';
import './unitConverter.css';

function App() {
  const localStorageActiveTab = localStorage.getItem('activeTab')
  const [baseValue, setBaseValue] = useState('');
  const [activeTab, setActiveTab] = useState(localStorageActiveTab ? localStorageActiveTab : 0);
  const modes = data.modes;
  const activeMode = modes.filter((mode, index)=> parseInt(index) === parseInt(activeTab))[0];

  function onSelectMode(e) {
    const index = e.target.value;
    setBaseValue('');
    setActiveTab(index);
    localStorage.setItem('activeTab', index);
  }

  function onUnitInputChange(e, factor, formula) {
    const value = e.target.value;
    if (formula) {
      const dataFunction = new Function('num', `return ${formula.from}`);
      setBaseValue(dataFunction(value));
    } else {
      setBaseValue(value / factor);
    }
  }

  function calcInputValue(factor, formula) {
    if (!baseValue) {
      return '';
    }
    if (formula) {
      const dataFunction = new Function('num', `return ${formula.to}`);
      return formatvalue(dataFunction(baseValue));
    }
    const value = formatvalue(baseValue * factor);
    return value;
  }

  function formatvalue(num) {
    if (isNaN(num)) {
      return '';
    }
    const value = Math.round(num * 1000) / 1000;
    return parseFloat(value);
  }

  return (
    <div className='outerWrap'>
      <div className='container'>
      <div className='modeSelectWrap'>
        <label htmlFor="modeSelect">Mode:</label>
        <select
          id="modeSelect"
          className='modeSelect'
          value={activeTab}
          onChange={(e) => {
            onSelectMode(e);
          }}
        >
          {modes.map((mode, index) => {
            return <option value={index} key={index}>{mode.name}</option>;
          })}
        </select>
      </div>
      <div className='formWrapper'>
              <div className='modeForm'>
                {activeMode.unitInputs.map((unitInput, index) => {
                  return (
                    <div key={index} className='modeFormUnit'>
                      <label
                        htmlFor={unitInput.label}
                        dangerouslySetInnerHTML={{ __html: unitInput.label }}
                      />
                      <input
                        type='number'
                        step='any'
                        name={unitInput.label}
                        value={calcInputValue(
                          unitInput.factor,
                          unitInput.formula
                        )}
                        data-factor={unitInput.factor}
                        onChange={(e) => {
                          onUnitInputChange(
                            e,
                            unitInput.factor,
                            unitInput.formula
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
      </div>
      </div>
      <div className="bottomBar">
        <a href="https://github.com/dvacreative/react_unit_converter" target="_blank" rel="noreferrer">
        <i className="ri-github-fill ri-xl"></i>
      </a>
      </div>
    </div>
  );
}

export default App;
