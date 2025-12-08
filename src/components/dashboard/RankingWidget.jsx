import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, User, Zap, Trophy } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { useRanking } from '../../hooks/useRanking';

const RankingWidget = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  
  const { data: personalRankList, isLoading, error } = useRanking(isLoggedIn);


//서브 컴포넌트들
  const LoadingOrError = () => {
    if (isLoading) return <div className="p-8 flex justify-center items-center h-full"><span className="text-gray-500 animate-pulse">데이터 로딩 중...</span></div>;
    if (error) return <div className="p-8 flex justify-center items-center h-full"><span className="text-red-500">서버 연결 실패: {error}</span></div>;
    return null;
  };

  const ProfileSlide = () => (
    <div className="p-8 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-6 h-6 mr-2 text-emerald-500" /> 마이페이지
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-500 flex items-center">
              <Zap className="w-4 h-4 mr-1 text-emerald-600" /> 내 포인트
            </span>
            <span className="font-bold text-emerald-600 text-lg">1,250 P</span>
          </div>
          {/* 필요한 경우 myRankInfo 데이터를 여기에 표시 */}
        </div>
      </div>
      <button onClick={() => navigate('/myprofile')} className="w-full mt-6 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl hover:bg-emerald-100 transition-all font-medium shadow-md">
        자세히 보기
      </button>
    </div>
  );

  const PersonalRankSlide = () => {
    if (isLoading || error) return <LoadingOrError />;
    
    return (
      <div className="p-8 flex flex-col justify-between h-full relative">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" /> 개인 포인트 랭킹
          </h3>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 scrollbar-hide">
            {personalRankList && personalRankList.length > 0 ? (
              personalRankList.map((item) => (
                <div key={item.rank} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition">
                  <span className="w-5 h-5 text-center font-bold flex justify-center items-center">
                    {item.rank <= 3 ? (
                      <Award className={`w-5 h-5 ${item.rank === 1 ? 'text-yellow-500' : item.rank === 2 ? 'text-gray-400' : 'text-orange-400'}`} />
                    ) : (
                      <span className='text-gray-500 text-sm'>{item.rank}</span>
                    )}
                  </span>
                  <span className="font-medium text-gray-700 truncate flex-1">{item.memberId || '익명'}</span>
                  <span className="ml-auto text-sm text-gray-500">{item.point?.toLocaleString() || 0} P</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">랭킹 데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LoginPrompt = () => (
    <div className="p-8 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">로그인 필요</h3>
        <p className="text-gray-600 mb-6">로그인하고 내 포인트와 지역 랭킹을 확인하세요.</p>
      </div>
      <button onClick={() => navigate('/signup')} className="w-full mt-6 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-lg shadow-emerald-200">
        로그인 하러 가기
      </button>
    </div>
  );

  return (
    <div className="col-span-12 md:col-span-4 row-span-4 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px] relative">
      {isLoggedIn ? (
        <Swiper 
          modules={[Pagination, Autoplay]} 
          pagination={{ clickable: true }} 
          autoplay={{ delay: 3500, disableOnInteraction: false }} 
          loop={true} 
          className="w-full h-full pb-6"
        >
          <SwiperSlide><ProfileSlide /></SwiperSlide>
          <SwiperSlide><PersonalRankSlide /></SwiperSlide>
          {/* 로컬 랭킹 슬라이드가 필요하면 여기에 추가 */}
        </Swiper>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default RankingWidget;