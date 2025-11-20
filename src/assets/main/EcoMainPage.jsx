import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, ChevronRight, Home, ShoppingBag, Car
} from 'lucide-react';

import { useAuth } from '../auth/authContext/AuthorContext.jsx';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// 메인페이지의 카드 컴포넌트
import CalculatorWidget from '../common/calculator/CalculatorWidget.jsx';
import LocalEcoCard from './card/LocalEcoCard.jsx'; 
import RankingWidget from './card/RankingWidget.jsx'; 
import AdminToolsSection from './card/AdminToolsSection.jsx'; 

// src/assets/main/EcoMainPage.jsx
const EcoMainPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate(); 

  return (
    <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 pb-28">
      <div className="grid grid-cols-12 gap-5">
        
        {/* 1. 우리동네 환경지킴이 (LocalEcoCard로 분리) */}
        <LocalEcoCard />

        {/* 2. 랭킹 (RankingWidget으로 분리) */}
        <RankingWidget isLoggedIn={isLoggedIn} />

        {/* 3. 계산기 */}
        <CalculatorWidget />

        {/* 4. 초보자 가이드 */}
        <div className="col-span-12 md:col-span-6 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <BookOpen className="h-7 w-7 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">초보자 가이드</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-sm transition-colors flex justify-between items-center">
              <span>1. 탄소중립포인트란?</span> <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-sm transition-colors flex justify-between items-center">
              <span>2. 포인트 가입 및 인증 방법</span> <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-sm transition-colors flex justify-between items-center">
              <span>3. 포인트 사용처 안내</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. 에코 아카이브 */}
        <div className="col-span-7 md:col-span-5 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">에코 아카이브</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="group cursor-pointer p-4 bg-amber-50 rounded-2xl hover:shadow-md transition-all text-center">
              <Car className="h-6 w-6 text-amber-600 mb-2 inline-block" />
              <span className="text-xs font-medium text-gray-700 block">에너지</span>
            </div>
            <div className="group cursor-pointer p-4 bg-blue-50 rounded-2xl hover:shadow-md transition-all text-center">
            <Car className="h-6 w-6 text-blue-600 mb-2 inline-block" />
              <span className="text-xs font-medium text-gray-700 block">모빌리티</span>
            </div>
            <div className="group cursor-pointer p-4 bg-green-50 rounded-2xl hover:shadow-md transition-all text-center">
            <Home className="h-6 w-6 text-green-600 mb-2 inline-block" />
              <span className="text-xs font-medium text-gray-700 block">일상생활</span>
            </div>
            <div className="group cursor-pointer p-4 bg-purple-50 rounded-2xl hover:shadow-md transition-all text-center">
            <ShoppingBag className="h-6 w-6 text-purple-600 mb-2 inline-block" />
              <span className="text-xs font-medium text-gray-700 block">녹색소비</span>
            </div>
          </div>
        </div>
        
        {/* 6. 친환경 뉴스 (MainPage에 그대로 유지) */}
        <div className="col-span-5 md:col-span-3 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Eco 뉴스</h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">LIVE</span>
          </div>
          <div className="space-y-3">
            <div className="cursor-pointer group" onClick={() => navigate('/news')}>
              <p className="text-gray-900 font-medium text-sm group-hover:text-emerald-600">2026 전기차 보조금 개편안</p>
              <p className="text-gray-500 text-xs mt-1">2시간 전 · #A3 자동차</p>
            </div>
            <div className="cursor-pointer group" onClick={() => navigate('/news')}>
              <p className="text-gray-900 font-medium text-sm group-hover:text-emerald-600">서울시, 친환경 마을버스 시범 운행</p>
              <p className="text-gray-500 text-xs mt-1">5시간 전 · #B3 홍보</p>
            </div>
            <button 
              onClick={() => navigate('/news')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-3"
            >
              뉴스 더보기 ➔
            </button>
          </div>
        </div>

        {/* 7. 관리자 도구 (AdminToolsSection으로 분리) */}

        { localStorage.getItem("role") == "[ROLE_ADMIN]" ? ( <AdminToolsSection /> ) : ( <div></div> )}
        
      </div>
    </main>
  );
};

export default EcoMainPage;