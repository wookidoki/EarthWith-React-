import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../auth/authContext/AuthorContext.jsx"; // 경로가 확실해지면 주석 해제하세요.
import {
  PlusSquare, Search, ChevronRight, Eye, Droplet, Sun, Car,
  ShoppingBag, Users, BookOpen, FileText
} from 'lucide-react';

// 임시 인증 훅 
const useAuth = () => {
  return { isAdmin: true };
};

// 1. 카테고리별 스타일 매핑 헬퍼 함수 (UI 표현용)
const getCategoryStyle = (categoryCode) => {
  if (categoryCode?.startsWith('A1')) return { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' };
  if (categoryCode?.startsWith('A3')) return { icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('A5')) return { icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-100' };
  if (categoryCode?.startsWith('B2')) return { icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('B1')) return { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-100' };
  
  return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
};

const parseCategoryTag = (categoryStr) => {
  if (!categoryStr) return '기타';
  const parts = categoryStr.split(' ');
  return parts.length > 1 ? parts[1] : categoryStr;
};

const BoardPage = ({ pageFilter }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [allPostsData, setAllPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 상세 페이지 이동 핸들러
  const handlePostClick = (postId) => {
    navigate(`/board-detail/${postId}`);
  };

  // API 및 데이터 호출
  useEffect(() => {
    const API_BASE_URL = 'http://localhost:8081'; 

    const fetchBoards = async () => {
      setLoading(true);
      try {
        const [response] = await Promise.all([
          fetch(`${API_BASE_URL}/boards`)
        ]);
        if (!response.ok) {
          throw new Error('API 인증 오류');
        }

        const boardList = await response.json();

        // DB 데이터를 프론트엔드  형식으로 변환
        const transformedData = boardList.map(item => {
          const style = getCategoryStyle(item.boardCategory);
          return {
            id: item.boardNo,
            title: item.boardTitle,
            category: item.boardCategory || '기타',
            date: item.regDate,
            views: item.viewCount,
            likeCount: item.likeCount,
            icon: style.icon,
            color: style.color,
            // 이미지가 없으면 placeholder 사용
            img: `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.boardTitle ? item.boardTitle.substring(0, 4) : 'Eco')}`
          };
        });

        setAllPostsData(transformedData);

      } catch (error) {
        console.error("게시글 로딩 실패:", error);
        setAllPostsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // 1. 고유 카테고리 목록 생성 (필터 버튼용)
  const uniqueCategories = useMemo(() => {
    const relevantPosts = allPostsData.filter(post => {
      if (pageFilter === 'ALL') return true;
      if (pageFilter === 'A') return post.category.startsWith('A'); // DB 데이터 기준 필터링
      return false;
    });

    const categories = relevantPosts
      .map(post => parseCategoryTag(post.category))
      .filter((value, index, self) => self.indexOf(value) === index);
    return ['전체', ...categories.sort()];
  }, [pageFilter, allPostsData]);

  // 2. prop, 카테고리, 검색어에 따라 필터링된 게시물 데이터 생성
  const filteredPosts = useMemo(() => {
    const propFiltered = allPostsData.filter(post => {
      if (pageFilter === 'ALL') return true;
      if (pageFilter === 'A') return post.category.startsWith('A');
      return false;
    });

    const categoryFiltered = propFiltered.filter(post => {
      if (selectedCategory === '전체') return true;
      return parseCategoryTag(post.category) === selectedCategory;
    });

    const searchFiltered = categoryFiltered.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return searchFiltered;
  }, [pageFilter, selectedCategory, searchTerm, allPostsData]);

  const pageTitle = pageFilter === 'A' ? '관리자 게시물' : '전체 게시물';
  const pageDescription = pageFilter === 'A'
    ? '관리자가 등록한 주요 공지사항과 정보를 확인합니다.'
    : '모든 공공 및 관리자 게시물을 확인합니다.';

  const bentoPosts = filteredPosts.slice(0, 4);
  const listPosts = filteredPosts.slice(4);

  // 로딩 중 UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 flex justify-center items-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* 헤더 */}
      <header className="bg-white sticky top-20 z-30 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 mt-1">{pageDescription}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin-enroll')}
              className="flex items-center space-x-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30"
            >
              <PlusSquare className="w-5 h-5" />
              <span>새 글 작성</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* --- 검색 및 필터 컨트롤 패널 --- */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색창 */}
            <div className="relative w-full md:flex-1">
              <input
                type="text"
                placeholder="게시물 제목 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* 카테고리 필터 */}
            <div className="w-full md:flex-1 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 상단 벤토 그리드 */}
        {bentoPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 첫 번째 (가장 큰) 게시물 */}
            <div
              onClick={() => handlePostClick(bentoPosts[0].id)}
              className="md:col-span-1 md:row-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5">
                <img src={bentoPosts[0].img} alt={bentoPosts[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${bentoPosts[0].color.replace('text-', 'bg-').replace('500', '100')} ${bentoPosts[0].color}`}>
                  {parseCategoryTag(bentoPosts[0].category)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors">
                {bentoPosts[0].title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>{bentoPosts[0].date}</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{bentoPosts[0].views}</span>
                </span>
              </div>
            </div>

            {/* 나머지 벤토 게시물 */}
            {bentoPosts.slice(1, 4).map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex items-start space-x-5"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className={`text-xs font-bold ${post.color}`}>{parseCategoryTag(post.category)}</span>
                    <h3 className="text-md font-bold text-gray-800 mt-1 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-3 mt-2">
                    <span>{post.date}</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 게시물 리스트 */}
        {listPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">최신 게시물</h2>
            <div className="space-y-6">
              {listPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
                >
                  <div className="w-full md:w-48 h-32 md:h-full flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-bold ${post.color}`}>{parseCategoryTag(post.category)}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-6">
                      <span>{post.date}</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-rose-500">
                        <span>♥</span>
                        <span>{post.likeCount}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 게시물 없음 메시지 */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700">게시물이 없습니다.</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '선택한 카테고리에 해당하는 게시물이 없습니다.'}
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default BoardPage;