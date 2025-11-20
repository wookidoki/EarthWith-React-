import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Newspaper, Droplet, Zap, Car, Home, ShoppingBag, Eye, ArrowRight, Loader2
} from 'lucide-react';

// 뉴스 페이지 컴포넌트
const NewsPage = () => {
  // --- 상태 관리 ---
  const [newsData, setNewsData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // --- 백엔드 API 호출 함수 ---
  const fetchNews = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const queryParam = query || '환경';
      const response = await fetch(`http://localhost:8081/api/news?query=${queryParam}`);
      
      if (!response.ok) {
        throw new Error('서버 통신 실패');
      }
      
      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      console.error("뉴스 로딩 실패:", err);
      setError('뉴스를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchNews('환경');
  }, []);

  // 엔터키 검색 핸들러
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchNews(searchTerm);
    }
  };

  // --- 데이터 필터링 로직 (useMemo) ---
  const { featuredNews, listNews } = useMemo(() => {
    if (!newsData || newsData.length === 0) return { featuredNews: [], listNews: [] };

    // 조회수(views) 기준 내림차순 정렬
    const sortedNews = [...newsData].sort((a, b) => b.views - a.views);
    
    // 상위 3개는 벤토 그리드용 (주요 뉴스)
    const featured = sortedNews.slice(0, 3);
    
    // 나머지는 리스트용
    const list = sortedNews.slice(3);
    
    return { featuredNews: featured, listNews: list };
  }, [newsData]);

  // --- 페이지 제목 설정 ---
  const pageTitle = '환경 소식';
  const pageSubtitle = 'API에서 가져온 최신 환경 뉴스를 확인하세요.';

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* 헤더 및 검색 */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 mt-1">{pageSubtitle}</p>
          </div>
          <div className="relative mt-4 md:mt-0 w-full md:w-72">
            <input
              type="text"
              placeholder="뉴스 검색 (Enter)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* 로딩 상태 표시 */}
        {loading && (
            <div className="flex justify-center items-center h-60">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        )}

        {/* 에러 상태 표시 */}
        {error && (
            <div className="text-center p-10 text-red-500 bg-white rounded-xl shadow-sm">
                {error}
            </div>
        )}

        {/* 컨텐츠 영역 */}
        {!loading && !error && (
            <>
                {/* --- 벤토 그리드 (인기 뉴스) --- */}
                {featuredNews.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[220px] mb-12">
                    {/* 첫 번째 아이템 (가장 큰) */}
                    <div 
                        className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-lg group relative cursor-pointer"
                        onClick={() => window.open(featuredNews[0].link, '_blank')}
                    >
                      <img 
                        src={featuredNews[0].imageUrl} 
                        alt={featuredNews[0].title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        onError={(e) => e.target.src = 'https://placehold.co/600x400/34d399/ffffff?text=Image+Error'} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-emerald-600 rounded">
                            {featuredNews[0].category}
                        </span>
                        <h2 className="text-2xl font-bold text-white leading-tight">
                          {featuredNews[0].title}
                        </h2>
                      </div>
                    </div>
                    
                    {/* 두 번째 아이템 */}
                    {featuredNews.length > 1 && (
                      <div 
                        className="rounded-3xl overflow-hidden shadow-lg group relative cursor-pointer"
                        onClick={() => window.open(featuredNews[1].link, '_blank')}
                      >
                        <img 
                            src={featuredNews[1].imageUrl} 
                            alt={featuredNews[1].title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => e.target.src = 'https://placehold.co/600x400/f59e0b/ffffff?text=Image+Error'} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-5 left-5 right-5">
                          <h2 className="text-lg font-bold text-white leading-tight">
                            {featuredNews[1].title}
                          </h2>
                        </div>
                      </div>
                    )}
                    
                    {/* 세 번째 아이템 */}
                    {featuredNews.length > 2 && (
                      <div 
                        className="rounded-3xl overflow-hidden shadow-lg group relative cursor-pointer"
                        onClick={() => window.open(featuredNews[2].link, '_blank')}
                      >
                        <img 
                            src={featuredNews[2].imageUrl} 
                            alt={featuredNews[2].title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => e.target.src = 'https://placehold.co/600x400/60a5fa/ffffff?text=Image+Error'} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-5 left-5 right-5">
                          <h2 className="text-lg font-bold text-white leading-tight">
                            {featuredNews[2].title}
                          </h2>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 일반 게시물 리스트 (최신 소식 또는 나머지) --- */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">최신 소식</h2>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {/* 뉴스가 없는 경우 */}
                      {newsData.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                          {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '표시할 뉴스가 없습니다.'}
                        </li>
                      )}

                      {listNews.map((news) => {
                        return (
                          <li 
                            key={news.id} 
                            className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => window.open(news.link, '_blank')}
                          >
                            <div className="flex space-x-4 items-center">
                              {/* 썸네일 (이미지 또는 아이콘) */}
                              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-20 bg-gray-100 rounded-lg overflow-hidden">
                                {news.imageUrl ? (
                                  <img 
                                    src={news.imageUrl} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { 
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Newspaper className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              
                              {/* 텍스트 컨텐츠 */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1 line-clamp-2">
                                  {news.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                    <span className="text-emerald-600 font-medium">{news.category}</span>
                                    <span>•</span>
                                    <span>{news.date}</span>
                                    <span>•</span>
                                    <span className="flex items-center"><Eye className="w-3 h-3 mr-1"/> {news.views}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{news.description}</p>
                              </div>
                              
                              {/* 화살표 아이콘 */}
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;