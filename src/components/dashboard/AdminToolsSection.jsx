import React from 'react';
import { useNavigate } from 'react-router-dom';
// [수정 01] Megaphone 아이콘 import 추가
import { BarChart3, Settings, Users, CheckSquare, List, Megaphone } from 'lucide-react';

const AdminToolsSection = () => {
  const navigate = useNavigate();
  
  // [수정 02] adminMenus 배열에 '공지사항 관리' 추가
  const adminMenus = [
    { name: '게시글/리뷰 관리', path: '/admin/board', icon: List, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { name: '인증 및 포인트', path: '/admin/score', icon: CheckSquare, bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { name: '통계 대시보드', path: '/admin/stats', icon: BarChart3, bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { name: '회원/신고 관리', path: '/admin/board', icon: Users, bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { name: '공지사항 관리', path: '/admin/notice', icon: Megaphone, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  ];

  return (
    <div className="col-span-12 md:col-span-4 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold text-gray-900">관리자 도구</h3>
        <Settings className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {adminMenus.map((menu) => (
          <div key={menu.name} onClick={() => navigate(menu.path)} className={`cursor-pointer p-3 ${menu.bgColor} rounded-xl flex flex-col items-center justify-center hover:bg-opacity-80 transition-all`}>
            <menu.icon className={`h-5 w-5 ${menu.textColor} mb-1`} />
            <span className={`text-xs ${menu.textColor} font-medium`}>{menu.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminToolsSection;