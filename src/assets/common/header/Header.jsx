import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // 1. useNavigate 제거, Link 사용
import { Leaf, Clock, User } from 'lucide-react';
import { AuthContext } from '../../auth/authContext/AuthorContext';


const Header = () => {
  const [climateTime, setClimateTime] = useState('...'); // 3. 초기값 수정

  const { auth, logout } = useContext(AuthContext); // Context에서 로그인 상태 가져오기



  useEffect(() => {
    // 2. 마감 시한 설정 (KST 기준)
    const deadline = new Date('2029-07-23T00:59:54').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        clearInterval(interval);
        setClimateTime('0년 0일 00:00:00');
        return;
      }

      const msPerDay = 1000 * 60 * 60 * 24;
      const msPerYear = msPerDay * 365.2425; 

      const years = Math.floor(diff / msPerYear);
      const days = Math.floor((diff % msPerYear) / msPerDay);
      const hours = Math.floor((diff % msPerDay) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fHours = String(hours).padStart(2, '0');
      const fMinutes = String(minutes).padStart(2, '0');
      const fSeconds = String(seconds).padStart(2, '0');

      setClimateTime(`${years}년 ${days}일 ${fHours}:${fMinutes}:${fSeconds}`);

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 h-20"> {/* 4. 높이 고정 (h-20) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-full"> {/* 5. h-full 추가 */}
        <div className="flex justify-between items-center h-full"> {/* 6. h-full 추가 */}
          
          {/* 로고 */}
          <Link to="/main" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">어스윗</span>
          </Link>

          {/* 시계 */}
          <div className="hidden md:flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-gray-700 font-medium">
              1.5℃ 상승까지 남은 시간 <br />
              {climateTime}
            </span>
          </div>

          {/* 로그인/로그아웃 버튼 */}
          <div className="flex items-center space-x-6">
            { localStorage.getItem("memberId") ? (
              // 5. 마이페이지 버튼
              <>
              <Link 
                to="/myprofile" 
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>마이페이지</span>
              </Link>
              <button
                  onClick={logout}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium shadow-md shadow-gray-300"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // 6. 로그인 버튼
              <Link 
                to="/signup"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium shadow-md shadow-gray-300"
              >
                로그인
            	</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;