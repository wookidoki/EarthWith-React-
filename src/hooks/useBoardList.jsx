import { useState, useEffect } from 'react';
import { Sun, Car, ShoppingBag, Users, BookOpen, FileText } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081';

// 카테고리 스타일 매퍼 (파일 내부 정의)
export const getCategoryStyle = (categoryCode) => {
  if (categoryCode?.startsWith('A1')) return { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' };
  if (categoryCode?.startsWith('A3')) return { icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('A5')) return { icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-100' };
  if (categoryCode?.startsWith('B2')) return { icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('B1')) return { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-100' };
  return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
};

export const useBoardList = (pageFilter) => {
  const [listPosts, setListPosts] = useState([]); // 일반 리스트
  const [topPosts, setTopPosts] = useState([]);   // 상위 3개 (Bento)
  const [pageInfo, setPageInfo] = useState(null); // 페이징 정보
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 데이터 변환 헬퍼 함수
  const transformData = (data) => {
    if (!data) return [];
    return data.map(item => {
      const style = getCategoryStyle(item.boardCategory);
      return {
        id: item.boardNo,
        title: item.boardTitle,
        category: item.boardCategory,
        date: item.regDate, // 필요시 포맷팅 로직 추가
        views: item.viewCount,
        likeCount: item.likeCount,
        icon: style.icon,
        color: style.color,
        // 이미지가 null일 경우 대비 및 placeholder 처리
        img: `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.boardTitle ? item.boardTitle.substring(0,4) : 'No Image')}`
      };
    });
  };

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        // 백엔드 컨트롤러에 page 파라미터 전달
        const response = await fetch(`${API_BASE_URL}/boards?page=${currentPage}`);
        if (!response.ok) throw new Error('데이터 로딩 실패');
        
        const data = await response.json();
        
        // 백엔드에서 반환하는 Map 구조 { topPosts: [], list: [], pi: {} } 에 대응
        setTopPosts(transformData(data.topPosts));
        setListPosts(transformData(data.list));
        setPageInfo(data.pi);

      } catch (error) {
        console.error("게시판 로드 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [currentPage]); // 페이지 변경 시 재호출

  // 클라이언트 사이드 필터링 (현재 페이지 내 데이터만 필터링됨)
  // 검색 기능이 중요하다면 추후 서버 사이드 검색(?keyword=...)으로 변경 권장
  const filteredListPosts = listPosts.filter(p => {
    const matchCat = selectedCategory === '전체' || p.category === selectedCategory;
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return { 
    topPosts, 
    filteredListPosts, 
    pageInfo, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    setCurrentPage, 
    uniqueCategories: ['전체', 'A1', 'A3', 'B1', 'B2'] // 필요한 카테고리 목록 정의
  };
};