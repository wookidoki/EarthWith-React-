import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Clock, User } from 'lucide-react';
import { AuthContext } from '../../auth/authContext/AuthorContext';
import useClimateTime from '../../../hook/useClimateTime';

const Header = () => {
  const climateTime = useClimateTime(); 
  const { auth, logout } = useContext(AuthContext); 

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 h-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
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