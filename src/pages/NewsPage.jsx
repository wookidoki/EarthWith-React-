import React from 'react';
import { Search, Newspaper, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useNews } from '../hooks/useNews.jsx';

const NewsPage = () => {
  const { 
    newsData, searchTerm, setSearchTerm, loading, error, 
    featuredNews, listNews, handleSearch 
  } = useNews();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* [수정됨] md:stems-center -> md:items-center (오타 수정) */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">환경 소식</h1>
            <p className="text-gray-500 mt-1">API에서 가져온 최신 환경 뉴스를 확인하세요.</p>
          </div>
          {/* [수정됨] 불필요한 문자 's' 제거 */}
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

        {loading && <div className="flex justify-center items-center h-60"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>}
        {error && <div className="text-center p-10 text-red-500 bg-white rounded-xl shadow-sm">{error}</div>}

        {!loading && !error && (
          <>
            {/* 벤토 그리드 (인기 뉴스) */}
            {featuredNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[220px] mb-12">
                <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-lg group relative cursor-pointer" onClick={() => window.open(featuredNews[0].link, '_blank')}>
                  <img src={featuredNews[0].imageUrl || 'https://placehold.co/600x400/34d399/ffffff?text=News'} alt={featuredNews[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-emerald-600 rounded">{featuredNews[0].category || '뉴스'}</span>
                    <h2 className="text-2xl font-bold text-white leading-tight">{featuredNews[0].title}</h2>
                  </div>
                </div>
                {/* 나머지 추천 뉴스 렌더링 (필요 시 추가) */}
              </div>
            )}

            {/* 리스트 뉴스 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">최신 소식</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {listNews.map((news) => (
                    <li key={news.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => window.open(news.link, '_blank')}>
                      <div className="flex space-x-4 items-center">
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                           {news.imageUrl ? <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Newspaper className="w-8 h-8 text-gray-400"/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 mb-1 line-clamp-2">{news.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-2"><span>{news.date}</span><span>•</span><span className="flex items-center"><Eye className="w-3 h-3 mr-1"/> {news.views}</span></div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                      </div>
                    </li>
                  ))}
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