import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, User, Zap, Trophy, TrendingUp } from 'lucide-react';

// [수정] 요청하신 import 구문들 (Swiper)을 그대로 유지합니다.
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

//포트남바
const API_BASE_URL = 'http://localhost:8081';

const RankingWidget = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [personalRankList, setPersonalRankList] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState({ rank: 0, totalUsers: 0 });
  const [localRankList, setLocalRankList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const fetchPersonalRankList = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const personalListRes = await fetch(`${API_BASE_URL}/stats/member-rank-10`);


        if (!personalListRes.ok) {
          throw new Error('랭킹 순위 데이터를 불러오는 데 실패했습니다.');
        }

        const personalListData = await personalListRes.json(); // [{...}, {...}]

        setPersonalRankList(personalListData);

      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalRankList();

  }, [isLoggedIn]); 


  // --- 로딩/에러 공통 UI ---
  const renderLoadingOrError = () => {
    if (isLoading) {
      return <div className="p-8 flex justify-center items-center h-full"><span className="text-gray-500 animate-pulse">데이터 로딩 중...</span></div>;
    }
    if (error) {
      return <div className="p-8 flex justify-center items-center h-full"><span className="text-red-500">오류: {error}</span></div>;
    }
    return null;
  };

  // --- 슬라이드 1: 마이페이지 정보 UI ---
  const renderProfileInfo = () => (
    <div className="p-8 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-6 h-6 mr-2 text-emerald-500" /> 마이페이지
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 flex items-center"><Zap className="w-4 h-4 mr-1 text-emerald-600" /> 내 포인트</span>
            <span className="font-bold text-emerald-600 text-lg">1,250 P</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">내 지역 랭킹</span>
            <span className="font-bold text-gray-700">128 위</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">게시글 활동</span>
            <span className="font-bold text-gray-700">3 건</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/myprofile')}
        className="w-full mt-6 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl hover:bg-emerald-100 transition-all font-medium shadow-md"
      >
        자세히 보기
      </button>
    </div>
  );

  // --- 슬라이드 2: 개인별 포인트 랭킹 (Top 10) UI ---
  const renderPersonalRanking = () => {
    const loadingOrErrorUI = renderLoadingOrError();
    if (loadingOrErrorUI) return loadingOrErrorUI;

    return (
      <div className="p-8 flex flex-col justify-between h-full relative">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" /> 개인 포인트 랭킹
          </h3>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
            {/* [수정] personalRankList는 API에서 가져온 값으로 정상 표시됨 */}
            {personalRankList.length > 0 ? (
              personalRankList.map((item) => (
                <div key={item.rank} className="flex items-center space-x-3 p-2 rounded-lg transition">
                  <span className="w-5 h-5 text-center font-bold">
                    {item.rank <= 3 ? (
                      <Award className={`w-5 h-5 ${
                        item.rank === 1 ? 'text-yellow-500' :
                        item.rank === 2 ? 'text-gray-400' :
                        'text-orange-400'
                      }`} />
                    ) : (
                      <span className='text-gray-500 text-sm'>{item.rank}</span>
                    )}
                  </span>
                  <span className="font-medium text-gray-700 truncate">{item.MEMBERID || '이름 없음'}</span>
                  <span className="ml-auto text-sm text-gray-500">{item.MEMBERPOINT || 0} P</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">랭킹 데이터가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 오른쪽 하단: 나의 랭킹은? */}
        <div className="absolute bottom-6 right-8 text-right bg-emerald-50/70 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-inner border border-emerald-100">
          <p className="text-xs text-gray-600 font-medium">나의 랭킹은?</p>
          <p className="text-lg font-bold text-emerald-700 leading-none">
            {myRankInfo.rank} <span className="text-sm font-normal text-gray-600">/{myRankInfo.totalUsers}</span>
          </p>
        </div>
      </div>
    );
  };

  // --- 슬라이드 3: 지역 랭킹 UI ---
  const renderLocalRankingInfo = () => {
    const loadingOrErrorUI = renderLoadingOrError();
    if (loadingOrErrorUI) return loadingOrErrorUI;

    return (
      <div className="p-8 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-500" /> 지역 랭킹 (서울 강남구)
          </h3>
          <div className="space-y-4">
            {/* [수정] localRankList는 빈 배열이므로 "데이터가 없습니다."가 표시됨 */}
            {localRankList.length > 0 ? (
              localRankList.map((item) => (
                <div key={item.rank} className="flex items-center space-x-3 p-2 rounded-lg transition hover:bg-gray-50">
                  <Award className={`w-5 h-5 ${
                        item.rank === 1 ? 'text-yellow-500' :
                        item.rank === 2 ? 'text-gray-400' :
                        'text-orange-400'
                      }`} />
                  <span className="font-medium text-gray-700">{item.rank}. {item.name || '지역 없음'}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">지역 랭킹 데이터가 없습니다.</div>
            )}
          </div>
        </div>
        <button className="w-full mt-6 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium shadow-md">
          전체 랭킹 보기
        </button>
      </div>
    );
  };

  // --- 로그인 상태 UI (API 연동 불필요) ---
  const renderLoginPrompt = () => (
    <div className="p-8 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">로그인 필요</h3>
        <p className="text-gray-600 mb-6">
          로그인하고 내 포인트와 지역 랭킹을 확인하세요.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">지역 랭킹 (전국)</h3>
        {/* 로그아웃시 지역랭킹 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-700">1. 서울 강남구</span>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-700">2. 부산 해운대구</span>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-orange-400" />
            <span className="font-medium text-gray-700">3. 제주시</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/signup')}
        className="w-full mt-6 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-lg shadow-emerald-200"
      >
        로그인 하러 가기
      </button>
    </div>
  );

  // --- 메인 렌더링 ---
  return (
    <div className="col-span-12 md:col-span-4 row-span-4 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px] relative">
      {isLoggedIn ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          <SwiperSlide>{renderProfileInfo()}</SwiperSlide>
          <SwiperSlide>{renderPersonalRanking()}</SwiperSlide>
          <SwiperSlide>{renderLocalRankingInfo()}</SwiperSlide>
        </Swiper>
      ) : (
        renderLoginPrompt()
      )}
    </div>
  );
};

export default RankingWidget;