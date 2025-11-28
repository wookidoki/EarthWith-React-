import { useState, useMemo } from 'react';

const CARBON_FACTORS = {
  tumbler: { 
    label: '텀블러', 
    unit: '회', 
    co2Factor: 0.052, 
    description: '일회용 컵 대신 다회용기를 사용했습니다.'
  },
  transport: { 
    label: '도보/자전거', 
    unit: 'km', 
    co2Factor: 0.210, 
    description: '승용차 대신 걷거나 자전거를 탔습니다.'
  },
  receipt: { 
    label: '전자영수증', 
    unit: '건', 
    co2Factor: 0.003, 
    description: '종이 영수증 대신 전자 영수증을 받았습니다.'
  },
  // 전기 항목: 단위는 kWh
  electricity: {
    label: '전기 절약',
    unit: 'kWh',
    co2Factor: 0.478,
    description: '지난달 대비 전력 사용량을 줄였습니다.'
  }
};

export const useEcoCalculator = () => {
  const [activityType, setActivityType] = useState('tumbler');
  
  // 일반 입력값 (텀블러, 걷기 등)
  const [inputValue, setInputValue] = useState('');
  
  // 전기 전용 입력값 (지난달, 이번달)
  const [elecValues, setElecValues] = useState({ prev: '', curr: '' });

  const results = useMemo(() => {
    let value = 0;

    // 1. 전기일 경우: (지난달 - 이번달) 차이를 절감량으로 계산
    if (activityType === 'electricity') {
      const prev = parseFloat(elecValues.prev);
      const curr = parseFloat(elecValues.curr);
      
      // 둘 다 숫자가 아니거나, 이번달이 더 많으면(절약 실패) 계산 안 함
      if (isNaN(prev) || isNaN(curr) || prev <= curr) return null;
      value = prev - curr; // 절약한 양 (kWh)
    } 
    // 2. 나머지 경우: 입력값 그대로 사용
    else {
      value = parseFloat(inputValue);
      if (isNaN(value) || value <= 0) return null;
    }

    const currentFactor = CARBON_FACTORS[activityType];
    const co2Saved = value * currentFactor.co2Factor;

    return {
      co2Saved: co2Saved.toFixed(3),
      pineTrees: (co2Saved / 6.6).toFixed(4),
      savedAmount: value.toFixed(1) // 실제 절약한 수치 (횟수, km, kWh)
    };
  }, [inputValue, elecValues, activityType]);

  // 전기 입력 핸들러
  const handleElecChange = (field, val) => {
    setElecValues(prev => ({ ...prev, [field]: val }));
  };

  // 활동 타입 변경 시 초기화
  const handleTypeChange = (type) => {
    setActivityType(type);
    setInputValue('');
    setElecValues({ prev: '', curr: '' });
  };

  return {
    activityType,
    inputValue,
    elecValues, // 전기 입력값 내보내기
    results,
    categories: CARBON_FACTORS,
    setActivityType: handleTypeChange,
    setInputValue,
    setElecValues: handleElecChange // 전기 핸들러 내보내기
  };
};