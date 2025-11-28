import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusSquare, Search, ChevronRight, Eye, ChevronLeft } from 'lucide-react';
import { useBoardList } from '../hooks/useBoardList'; // 경로 확인 필요

const BoardPage = ({ pageFilter }) => {
  const navigate = useNavigate();
  // isAdmin 뿐만 아니라 로그인 여부(isLoggedIn)도 가져옵니다.
  const { isAdmin, isLoggedIn } = useAuth();
  
  const { 
    topPosts, filteredListPosts, pageInfo, loading, 
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, 
    uniqueCategories, setCurrentPage 
  } = useBoardList(pageFilter);

  const handlePostClick = (postId) => navigate(`/board-detail/${postId}`);

  const pageTitle = pageFilter === 'A' ? '관리자 게시물' : '커뮤니티 게시판';
  const pageDescription = pageFilter === 'A' 
    ? '공지사항 및 중요 정보를 확인합니다.' 
    : '자유롭게 소통하고 정보를 공유하세요.';

  // [핵심 로직] 글쓰기 버튼 표시 여부 결정
  // 1. 관리자 게시판('A')인 경우 -> 관리자(isAdmin)만 작성 가능
  // 2. 그 외(커뮤니티 등) -> 로그인한 사용자(isLoggedIn)라면 누구나 작성 가능
  const showWriteButton = pageFilter === 'A' ? isAdmin : isLoggedIn;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <header className="bg-white sticky top-20 z-30 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500 mt-1">{pageDescription}</p>
          </div>
          
          {/* 조건부 렌더링: 권한이 있는 경우에만 버튼 표시 */}
          {showWriteButton && (
            <button 
                onClick={() => navigate('/board-enroll')} 
                className="flex items-center space-x-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
            >
              <PlusSquare className="w-5 h-5" /><span>새 글 작성</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 검색 및 카테고리 필터 영역 */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
           <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:flex-1">
              <input type="text" placeholder="게시물 제목 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* 카테고리 버튼들 */}
            <div className="w-full md:flex-1 overflow-x-auto">
               <div className="flex space-x-2 pb-2">
                 {uniqueCategories.map((category) => (
                   <button key={category} onClick={() => setSelectedCategory(category)} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                     {category}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Bento 그리드 (조회수 상위 3개) */}
        {topPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* 첫 번째 게시물 (크게) */}
              {topPosts[0] && (
                 <div onClick={() => handlePostClick(topPosts[0].id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group md:col-span-1 md:row-span-2">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5">
                        <img src={topPosts[0].img} alt={topPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold">HOT</div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">{topPosts[0].title}</h2>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{topPosts[0].date}</span>
                        <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {topPosts[0].views}</span>
                    </div>
                 </div>
              )}
              
              {/* 두 번째, 세 번째 게시물 */}
              <div className="flex flex-col space-y-6">
                 {topPosts.slice(1, 3).map((post) => (
                     <div key={post.id} onClick={() => handlePostClick(post.id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group flex items-start space-x-5 h-full">
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                            <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <h2 className="text-md font-bold text-gray-900 mb-2 group-hover:text-emerald-600">{post.title}</h2>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {post.views}</span>
                            </div>
                        </div>
                     </div>
                 ))}
              </div>
          </div>
        )}

        {/* 일반 리스트 뷰 */}
        <div className="space-y-6">
            {filteredListPosts.map(post => (
                <div key={post.id} onClick={() => handlePostClick(post.id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-full md:w-48 h-32 md:h-full flex-shrink-0 rounded-xl overflow-hidden">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${post.color.replace('text-', 'bg-').replace('500', '100')} text-gray-700`}>{post.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-emerald-600">{post.title}</h3>
                        <div className="text-sm text-gray-500">{post.date} · 조회 {post.views}</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 hidden md:block" />
                </div>
            ))}
        </div>

        {/* Pagination Controls */}
        {pageInfo && (
            <div className="mt-12 flex justify-center items-center space-x-2">
                <button 
                    disabled={pageInfo.currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(pageInfo.endPage - pageInfo.startPage + 1)].map((_, idx) => {
                    const pageNum = pageInfo.startPage + idx;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                pageInfo.currentPage === pageNum 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button 
                    disabled={pageInfo.currentPage === pageInfo.maxPage}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageInfo.maxPage))}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default BoardPage;