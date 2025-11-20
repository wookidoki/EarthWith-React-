import { useState, useEffect } from 'react';

const DEADLINE = '2029-07-23T00:59:54';
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_YEAR = MS_PER_DAY * 365.2425; 

const useClimateTime = () => {
    const [climateTime, setClimateTime] = useState('...');
    
    const deadlineTime = new Date(DEADLINE).getTime();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            let diff = deadlineTime - now;

            if (diff <= 0) {
                clearInterval(interval);
                setClimateTime('0년 0일 00:00:00');
                return;
            }

            const years = Math.floor(diff / MS_PER_YEAR);
            diff %= MS_PER_YEAR;
            const days = Math.floor(diff / MS_PER_DAY);
            diff %= MS_PER_DAY;
            const hours = Math.floor(diff / MS_PER_HOUR);
            diff %= MS_PER_HOUR;
            const minutes = Math.floor(diff / MS_PER_MINUTE);
            const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND);

            const fHours = String(hours).padStart(2, '0');
            const fMinutes = String(minutes).padStart(2, '0');
            const fSeconds = String(seconds).padStart(2, '0');

            setClimateTime(`${years}년 ${days}일 ${fHours}:${fMinutes}:${fSeconds}`);
        }, 1000);

        return () => clearInterval(interval);
        
    }, [deadlineTime]);

    return climateTime;
};

export default useClimateTime;