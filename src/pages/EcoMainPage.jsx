import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Car, Home, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMainPage } from '../hooks/useMainpage'; 

import CalculatorWidget from '../components/widgets/CalculatorWidget'; 
import LocalEcoCard from '../components/dashboard/LocalEcoCard'; 
import RankingWidget from '../components/dashboard/RankingWidget'; 
import AdminToolsSection from '../components/dashboard/AdminToolsSection'; 



const EcoMainPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); 

// 초보자 가이드 버튼
const handleGuideClick = (id) => {
  navigate(`/board-detail/${id}`);
}

// 초보자 가이드
const guideList = [
  { title: '탄소중립포인트란?', id: 145 },
  { title: '포인트 가입 및 인증 방법', id: 146 },
  { title: '포인트 사용처 안내', id: 147 },
];
  
  const { 
    listNews, newsLoading, newsError, 
    mainStats, statsLoading, statsError 
  } = useMainPage();


  const truncateTitle = (title, maxLength = 20) => {
    if (!title) return '제목 없음';
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };
    
  const showAdminTools = localStorage.getItem("role") === "[ROLE_ADMIN]";
  
  const newsColumnClass = showAdminTools 
    ? "col-span-5 md:col-span-3" 
    : "col-span-5 md:col-span-7";

  const handleArchiveClick = (categoryCode) => {
    navigate(`/board-filtered?category=${categoryCode}`);
  };


  return (
    <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 pb-28">
      <div className="grid grid-cols-12 gap-5">
        
        <LocalEcoCard 
          stats={mainStats}
          loading={statsLoading}
          error={statsError}
        />
        <RankingWidget isLoggedIn={isLoggedIn} />

        <CalculatorWidget />

        <div className="col-span-12 md:col-span-6 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <BookOpen className="h-7 w-7 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">초보자 가이드</h3>
          <div className="space-y-3">
          {guideList.map((guide, idx) => (
            <button
              key={guide.id}
              onClick={() => handleGuideClick(guide.id)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-sm transition-colors flex justify-between items-center"
            >
              <span>{idx + 1}. {guide.title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>
        </div>

        <div className="col-span-7 md:col-span-5 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">에코 아카이브</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Car, label: '에너지', color: 'amber', code: 'A1', bgClass: 'bg-amber-50', textClass: 'text-amber-600' }, 
              { icon: Car, label: '모빌리티', color: 'blue', code: 'A2', bgClass: 'bg-blue-50', textClass: 'text-blue-600' }, 
              { icon: Home, label: '일상생활', color: 'green', code: 'A3', bgClass: 'bg-green-50', textClass: 'text-green-600' }, 
              { icon: ShoppingBag, label: '녹색소비', color: 'purple', code: 'A4', bgClass: 'bg-purple-50', textClass: 'text-purple-600' } 
            ].map((item, idx) => (
              <div 
                  key={idx} 
                  className={`group cursor-pointer p-4 ${item.bgClass} rounded-2xl hover:shadow-md transition-all text-center`}
                  onClick={() => handleArchiveClick(item.code)}
                >
                <item.icon className={`h-6 w-6 ${item.textClass} mb-2 inline-block`} />
                <span className="text-xs font-medium text-gray-700 block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`${newsColumnClass} bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Eco 뉴스</h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">LIVE</span>
          </div>
          <div className="space-y-3">
            
            {newsLoading && <p className="text-gray-500 text-sm">뉴스 로딩 중...</p>}
            {newsError && <p className="text-red-500 text-sm">뉴스 로드 오류: {newsError}</p>}

            {!newsLoading && !newsError && listNews.length > 0 ? (
              listNews.map((newsItem, index) => (
                <div key={index} className="cursor-pointer group">
                  <p 
                       onClick={() => navigate('/news')} 
                       className="text-gray-900 font-medium text-sm group-hover:text-emerald-600 transition-colors">
                    {truncateTitle(newsItem.title, 20)}
                  </p>
                </div>
              ))
            ) : (
              !newsLoading && !newsError && <p className="text-gray-500 text-sm">최신 뉴스가 없습니다.</p>
            )}
            
            <button onClick={() => navigate('/news')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-3">
              뉴스 더보기 ➔
            </button>
          </div>
        </div>

        {showAdminTools && <AdminToolsSection />}
        
      </div>
    </main>
  );
};

export default EcoMainPage;