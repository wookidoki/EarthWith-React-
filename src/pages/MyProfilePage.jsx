import React from 'react';
import { User, Leaf, Award, Activity, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useMyProfile } from '../hooks/useMyProfile';

const MyProfilePage = () => {
  const { currentUser, isAdmin, handleLogout, handleNavigateToAdmin } = useMyProfile();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-4 border-white shadow-md">
            <User className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{currentUser?.memberName || '사용자'}</h1>
            <p className="text-gray-500 mt-1">포인트: {currentUser?.memberPoint || 0}</p>
            {/* 통계 표시 부분 생략 (원래 코드 참조) */}
          </div>
          <button onClick={handleLogout} className="w-full md:w-auto md:ml-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2">
            <LogOut className="w-5 h-5" /><span>로그아웃</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isAdmin && (
            <div onClick={handleNavigateToAdmin} className="bg-white rounded-2xl shadow-lg border-2 border-emerald-500 p-6 flex items-center space-x-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-emerald-50">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><LayoutDashboard className="w-6 h-6" /></div>
              <div><h3 className="text-lg font-semibold text-emerald-700">관리자 페이지</h3><p className="text-sm text-gray-500">신고, 회원, 피드 관리</p></div>
            </div>
          )}
          {/* 기타 메뉴들 (Leaf, Award, Activity, Settings 등) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center space-x-6 hover:shadow-xl cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Leaf className="w-6 h-6" /></div>
            <div><h3 className="text-lg font-semibold text-gray-800">내 활동 내역</h3><p className="text-sm text-gray-500">내가 작성한 피드와 댓글 보기</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;