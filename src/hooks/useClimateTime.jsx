import { useState, useEffect } from 'react';

// 간단한 기후 위기 시계 훅 구현
const useClimateTime = () => {
  const [timeString, setTimeString] = useState('00년 00일 00:00:00');

  useEffect(() => {
    // 실제로는 API나 복잡한 계산이 들어감 (임시 로직)
    const deadline = new Date('2029-07-22').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = deadline - now;
      
      if (distance < 0) {
        setTimeString("시간 초과");
        return;
      }

      const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
      const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeString(`${years}년 ${days}일 ${hours}:${minutes}:${seconds}`);
    };

    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeString;
};

export default useClimateTime;