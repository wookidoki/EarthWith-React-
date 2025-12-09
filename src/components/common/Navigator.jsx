import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// 아이콘 변경: 직관성을 위해 교체
import { LayoutGrid, Compass, Newspaper, MessageCircle, Megaphone, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigator = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // 활성화 스타일 로직 개선
  const getButtonClass = (path) => {
    // 정확히 일치하거나, 하위 경로일 경우 체크 (예: /board-detail은 /board에 포함)
    const isActive = location.pathname === path || (path !== '/main' && location.pathname.startsWith(path));
    
    return isActive 
      ? "text-emerald-600 scale-110 bg-emerald-50 rounded-xl" // 활성화 시 배경색 은은하게 추가
      : "text-gray-400 hover:text-gray-600 hover:scale-105";
  };

  const navItemClass = "p-2 transition-all duration-300 flex flex-col items-center justify-center";

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-gray-100 z-50 w-[92%] max-w-lg">
      <div className="flex items-center justify-between">
        
        {/* 1. 메인 */}
        <Link to="/main" className={`${getButtonClass("/main")} ${navItemClass}`}>
          <LayoutGrid className="w-6 h-6" />
        </Link>

        {/* 2. 피드 (탐색 느낌의 Compass) */}
        <Link to="/feed" className={`${getButtonClass("/feed")} ${navItemClass}`}>
          <Compass className="w-6 h-6" />
        </Link>

        {/* 3. 뉴스 */}
        <Link to="/news" className={`${getButtonClass("/news")} ${navItemClass}`}>
          <Newspaper className="w-6 h-6" />
        </Link>

        {/* 4. 커뮤니티 (일반 게시판) */}
        <Link to="/board" className={`${getButtonClass("/board")} ${navItemClass}`}>
          <MessageCircle className="w-6 h-6" />
        </Link>

        {/* 5. 공지/관리자 게시판 (확성기 아이콘) */}
        <Link to="/board-filtered" className={`${getButtonClass("/board-filtered")} ${navItemClass}`}>
          <Megaphone className="w-6 h-6" />
        </Link>

        {/* 6. 마이페이지 */}
        <Link to={isLoggedIn ? "/myprofile" : "/signup"} className={`${getButtonClass(isLoggedIn ? "/myprofile" : "/signup")} ${navItemClass}`}>
          <User className="w-6 h-6" />
        </Link>

      </div>
    </div>
  );
};

export default Navigator;