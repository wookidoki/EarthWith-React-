import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8081';

export const useLanding = () => {
  // [변경] 시간 계산 훅 제거됨
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // [변경] 4개의 통계 데이터 초기값 설정
  const [stats, setStats] = useState([
    { number: "0", label: "함께하는 환경 지킴이" },   // 1. 회원 수
    { number: "0", label: "누적된 챌린지 기록" },     // 2. 게시글 수
    { number: "0", label: "실천된 에코 액션" },       // 3. 액션 합계
    { number: "0", label: "우리가 심은 나무 효과" }   // 4. 나무 환산
  ]);

  useEffect(() => {
    // 1. 스크롤 이벤트 및 슬라이더 타이머
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const sliderTimer = setInterval(() => setCurrentSlide(prev => (prev + 1) % 3), 4000);

    // 2. 통합 통계 데이터 Fetch (API 호출 1회)
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/landing`);
        if (!response.ok) throw new Error('서버 통신 실패');
        
        const data = await response.json();

        // 받아온 데이터를 State에 매핑 (쉼표 포맷 적용)
        setStats([
          { number: data.memberCount?.toLocaleString() || "0", label: "함께하는 환경 지킴이" },
          { number: data.totalPosts?.toLocaleString() || "0", label: "누적된 챌린지 기록" },
          { number: data.ecoActions?.toLocaleString() || "0", label: "실천된 에코 액션" },
          { number: (data.treeEffect?.toLocaleString() || "0") + "그루", label: "우리가 심은 나무 효과" }
        ]);

      } catch (e) {
        console.error("통계 로드 실패:", e);
      }
    };
    
    fetchStats();

    // 클린업
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(sliderTimer);
    };
  }, []);

  return { scrollY, currentSlide, setCurrentSlide, isVisible, stats };
};

export default useLanding;