import { useState, useEffect } from 'react';

// 백엔드 주소
const API_BASE_URL = 'http://localhost:8081';

export const useRanking = (isLoggedIn) => {
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const fetchRanking = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const response = await fetch(`${API_BASE_URL}/stats/ranking`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error(`통신 상태 코드: ${response.status}`);
        }

        const result = await response.json();
        
        console.log("랭킹 데이터 수신 성공:", result);
  
        setData(result);

      } catch (err) {
        console.error("Ranking Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [isLoggedIn]);

  return { data, isLoading, error };
};