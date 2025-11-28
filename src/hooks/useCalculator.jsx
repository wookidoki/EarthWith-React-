import { useState } from 'react';

export const useCalculator = () => {
  const [activeTab, setActiveTab] = useState('carbon'); 
  const [carbonInput, setCarbonInput] = useState('');
  const [carbonResult, setCarbonResult] = useState(null);
  const [waterInput, setWaterInput] = useState('');
  const [waterResult, setWaterResult] = useState(null);

  const handleCarbonCalc = () => {
    const value = parseFloat(carbonInput);
    setCarbonResult(!isNaN(value) ? value * 0.45 : null);
  };

  const handleWaterCalc = () => {
    const value = parseFloat(waterInput);
    setWaterResult(!isNaN(value) ? value * 120 : null);
  };

  return {
    activeTab, setActiveTab,
    carbonInput, setCarbonInput, carbonResult, handleCarbonCalc,
    waterInput, setWaterInput, waterResult, handleWaterCalc
  };
};