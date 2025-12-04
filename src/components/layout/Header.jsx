import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Clock, User, Megaphone } from 'lucide-react'; // Megaphone 아이콘 추가
import { useAuth } from '../../context/AuthContext';
import useClimateTime from '../../hooks/useClimateTime';

const Header = () => {
  const climateTime = useClimateTime(); 
  // [수정 1] isAdmin 추가 (AuthContext에서 가져옴)
  const { currentUser, logout, isAdmin } = useAuth(); 

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 h-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          <Link to="/main" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">어스윗</span>
          </Link>

          <div className="hidden md:flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-gray-700 font-medium">
              1.5℃ 상승까지 남은 시간 <br />
              {climateTime}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            { currentUser ? (
              <>
                {/* [수정 02] 관리자일 경우에만 '공지 관리' 버튼 표시 */}
                {isAdmin && (
                  <Link 
                    to="/admin/notice" 
                    className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm font-bold flex items-center space-x-1"
                  >
                    <Megaphone className="h-5 w-5" />
                    <span>공지 관리</span>
                  </Link>
                )}

                <Link to="/admin/notice" className="flex items-center space-x-1 text-emerald-600 font-bold hover:text-emerald-800">
                  <Megaphone className="h-5 w-5" />
                  <span>공지 관리</span>
                </Link>
                <Link to="/myprofile" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center space-x-2">
                  <User className="h-5 w-5" /><span>마이페이지</span>
                </Link>
                <button onClick={logout} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium shadow-md shadow-gray-300">로그아웃</button>
              </>
            ) : (
              <Link to="/signup" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium shadow-md shadow-gray-300">로그인</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;