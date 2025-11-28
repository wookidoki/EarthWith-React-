import { useState, useEffect } from 'react';
// [중요] 절대 경로로 수정됨
import useClimateTime from '/src/hooks/useClimateTime.jsx';

const API_BASE_URL = 'http://localhost:8081';

export const useLanding = () => {
  const climateTime = useClimateTime();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const [stats, setStats] = useState([a
    { number: "...", label: "1.5℃ 상승까지 남은 시간" },
    { number: "...", label: "참여중인 환경 지킴이" },
    { number: "89톤", label: "이번달 CO₂ 절감량" },
    { number: "...", label: "진행중인 챌린지" }
  ]);

  useEffect(() => {
    setStats(prev => [{ ...prev[0], number: climateTime }, prev[1], prev[2], prev[3]]);
  }, [climateTime]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const sliderTimer = setInterval(() => setCurrentSlide(prev => (prev + 1) % 3), 4000);

    const fetchStats = async () => {
      try {
        const [resMembers, resBoards] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/member-count`),
          fetch(`${API_BASE_URL}/stats/boards-join`)
        ]);
        
        const memberData = await resMembers.json();
        const boardData = await resBoards.json();

        setStats(prev => [
           prev[0],
           { ...prev[1], number: memberData.memberCount?.toLocaleString() || "0" }, 
           prev[2],
           { ...prev[3], number: boardData.boardParticipationCount?.toLocaleString() || "0" }
         ]);
      } catch (e) {
        console.error("통계 로드 실패 (서버 꺼짐 등):", e);
      }
    };
    fetchStats();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(sliderTimer);
    };
  }, []);

  return { scrollY, currentSlide, setCurrentSlide, isVisible, stats };
};