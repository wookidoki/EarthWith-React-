import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Coins, Calendar } from 'lucide-react';

const ProfileHeader = ({ user, stats }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // 로그아웃 처리
    logout();
    navigate('/login');
  };

  const handleProfileEdit = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        
        {/* 프로필 사진 */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
            {user?.memberImage ? (
              <img 
                src={user.memberImage} 
                alt="프로필" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-emerald-600" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
            <span className="text-white text-xs font-medium">사진 변경</span>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {user?.memberName || '사용자'}
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              🌱 새싹
            </span>
          </div>
          
          <p className="text-gray-500 mb-1">{user?.email || 'email@example.com'}</p>
          
          <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-600">
                {user?.memberPoint || 0}P
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>가입일: {user?.enrollDate || '2024.01.15'}</span>
            </span>
          </div>

          {/* 활동 통계 */}
          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
              <p className="text-xs text-gray-500">작성글</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.comments}</p>
              <p className="text-xs text-gray-500">댓글</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.likes}</p>
              <p className="text-xs text-gray-500">좋아요</p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col space-y-2">
          <button 
            onClick={handleProfileEdit}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all shadow-sm">
            프로필 수정
          </button>
          <button 
            onClick={handleLogout} 
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 shadow-sm">
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;