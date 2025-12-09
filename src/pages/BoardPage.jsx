import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusSquare, Search, ChevronRight, Eye, ChevronLeft } from 'lucide-react';
import { useBoardList } from '../hooks/useBoardList'; 

const BoardPage = ({ pageFilter }) => {
  const navigate = useNavigate();
  // URL 쿼리를 읽기 위해 useLocation 사용
  const location = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();

  const {
    topPosts, 
    filteredListPosts, 
    pageInfo, 
    loading,
    searchTerm, 
    setSearchTerm, 
    selectedCategoryCode,
    setSelectedCategoryCode,
    categoryList,          
    setCurrentPage
  } = useBoardList(pageFilter);


  // ⭐ 💡 URL 쿼리 파라미터를 읽어와 초기 카테고리를 설정하는 useEffect 추가
  useEffect(() => {
    // URLSearchParams를 사용하여 'category' 쿼리 값 추출
    const params = new URLSearchParams(location.search);
    const urlCategory = params.get('category');
    
    if (urlCategory) {
      // 훅의 상태를 URL 값으로 설정
      setSelectedCategoryCode(urlCategory);
      setCurrentPage(1); // 카테고리 변경 시 페이지를 1로 초기화
    } else {
      // 쿼리가 없다면 'ALL'로 초기화 (훅의 기본값과 일치시키기 위해)
      setSelectedCategoryCode('ALL');
    }
  }, [location.search, setSelectedCategoryCode, setCurrentPage]); // location.search가 변경될 때마다 실행

  const handlePostClick = (postId) => navigate(`/board-detail/${postId}`);

  // 페이지 타입에 따른 UI 텍스트 설정
  const isNoticeBoard = pageFilter === 'A';
  const pageTitle = isNoticeBoard ? '관리자 소식' : '커뮤니티';
  const pageDescription = isNoticeBoard
    ? '에코어스의 주요 정책과 소식을 확인하세요.'
    : '정보 공유, 봉사 모집, 공동구매 등 자유롭게 소통하세요.';

  // 글쓰기 권한 체크
  const showWriteButton = isNoticeBoard ? isAdmin : isLoggedIn;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* 헤더 */}
      <header className="bg-white sticky top-20 z-30 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500 mt-1">{pageDescription}</p>
          </div>
          
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
        {/* 필터 섹션 */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
           <div className="flex flex-col md:flex-row gap-4">
            {/* 검색창 */}
            <div className="relative w-full md:flex-1">
              <input 
                type="text" 
                placeholder="제목으로 검색..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {/* 카테고리 탭 */}
            <div className="w-full md:flex-1 overflow-x-auto">
               <div className="flex space-x-2 pb-2">
                 {categoryList.map((cat) => (
                   <button 
                     key={cat.code} 
                     onClick={() => {
                        setSelectedCategoryCode(cat.code);
                        setCurrentPage(1); 
                     }} 
                     className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        selectedCategoryCode === cat.code 
                        ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
                   >
                     {cat.name}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Bento Grid (상단 인기 게시물) */}
        {topPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* 메인 핫 게시물 */}
              {topPosts[0] && (
                 <div onClick={() => handlePostClick(topPosts[0].id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group md:col-span-1 md:row-span-2 relative overflow-hidden">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5">
                        <img src={topPosts[0].img} alt={topPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-md z-10">HOT</div>
                    </div>
                    <span className={`inline-block px-2 py-1 mb-2 rounded text-xs font-bold ${topPosts[0].bg} ${topPosts[0].color}`}>
                        {topPosts[0].categoryName}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 line-clamp-2">{topPosts[0].title}</h2>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{topPosts[0].date}</span>
                        <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {topPosts[0].views}</span>
                    </div>
                 </div>
              )}
              
              {/* 서브 인기 게시물 2개 */}
              <div className="flex flex-col space-y-6">
                 {topPosts.slice(1, 3).map((post) => (
                     <div key={post.id} onClick={() => handlePostClick(post.id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group flex items-start space-x-5 h-full relative overflow-hidden">
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                            <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <div className="flex flex-col justify-between h-full w-full">
                            <div>
                                <span className={`inline-block px-2 py-0.5 mb-1 rounded text-[10px] font-bold ${post.bg} ${post.color}`}>
                                    {post.categoryName}
                                </span>
                                <h2 className="text-md font-bold text-gray-900 mb-1 group-hover:text-emerald-600 line-clamp-2">{post.title}</h2>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {post.views}</span>
                            </div>
                        </div>
                     </div>
                 ))}
              </div>
          </div>
        )}

        {/* 일반 리스트 */}
        <div className="space-y-4">
            {filteredListPosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-medium">등록된 게시물이 없습니다.</p>
                </div>
            ) : (
                filteredListPosts.map(post => (
                    <div key={post.id} onClick={() => handlePostClick(post.id)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-full md:w-48 h-32 md:h-full flex-shrink-0 rounded-xl overflow-hidden">
                            <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${post.bg} ${post.color} flex items-center gap-1`}>
                                    {post.icon && <post.icon className="w-3 h-3" />}
                                    {post.categoryName}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-emerald-600 line-clamp-1">{post.title}</h3>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                                <span>{post.date}</span>
                                <span>·</span>
                                <span>조회 {post.views}</span>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 hidden md:block" />
                    </div>
                ))
            )}
        </div>

        {/* 페이지네이션 */}
        {pageInfo && (
            <div className="mt-12 flex justify-center items-center space-x-2">
                <button 
                    disabled={pageInfo.currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
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
                                ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
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
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
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