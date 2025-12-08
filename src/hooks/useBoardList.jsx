import { useState, useEffect } from 'react';
import { 
  Sun, Car, Coffee, ShoppingBag, 
  Info, HeartHandshake, Megaphone, ShoppingCart, 
  FileText, MoreHorizontal 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081';

const CATEGORY_CONFIG = {
  // --- 관리자(A) 카테고리 ---
  'A1': { name: '에너지', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' },
  'A2': { name: '자동차', icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' },
  'A3': { name: '일상생활', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100' },
  'A4': { name: '녹색소비', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-100' },
  'AN': { name: '기타', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-100' },

  // --- 공공/회원(B) 카테고리 ---
  'B1': { name: '정보', icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  'B2': { name: '봉사모집', icon: HeartHandshake, color: 'text-rose-500', bg: 'bg-rose-100' },
  'B3': { name: '홍보', icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-100' },
  'B4': { name: '공동구매', icon: ShoppingCart, color: 'text-teal-600', bg: 'bg-teal-100' },
  'BN': { name: '기타', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-100' },
  
  'DEFAULT': { name: '일반', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' }
};

export const useBoardList = (pageFilter) => {
  const [listPosts, setListPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('ALL'); // 코드로 관리 ('ALL', 'A1'...)

  const transformData = (data) => {
    if (!data) return [];
    return data.map(item => {
      const config = CATEGORY_CONFIG[item.boardCategory] || CATEGORY_CONFIG['DEFAULT'];
      return {
        id: item.boardNo,
        title: item.boardTitle,
        categoryCode: item.boardCategory,
        categoryName: config.name, 
        date: item.regDate,
        views: item.viewCount,
        likeCount: item.likeCount || 0,
        icon: config.icon,
        color: config.color,
        bg: config.bg,
        img: item.attachmentPath 
             || `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(item.boardTitle?.substring(0,4))}`
      };
    });
  };

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          type: pageFilter,
          category: selectedCategoryCode === 'ALL' ? '' : selectedCategoryCode, 
          keyword: searchTerm
        });

        const response = await fetch(`${API_BASE_URL}/boards?${queryParams}`);
        if (!response.ok) throw new Error('데이터 로딩 실패');
        
        const data = await response.json();
        
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
  }, [currentPage, pageFilter, selectedCategoryCode, searchTerm]);

  // 화면 상단 탭에 뿌려줄 카테고리 목록 생성
  const getCategoryList = () => {
    const base = [{ code: 'ALL', name: '전체' }];
    const targets = pageFilter === 'A' 
      ? ['A1', 'A2', 'A3', 'A4', 'AN'] 
      : ['B1', 'B2', 'B3', 'B4', 'BN'];

    return base.concat(targets.map(code => ({
      code: code,
      name: CATEGORY_CONFIG[code].name
    })));
  };

  return { 
    topPosts, 
    filteredListPosts: listPosts, 
    pageInfo, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    selectedCategoryCode, 
    setSelectedCategoryCode,
    categoryList: getCategoryList(), // 화면 렌더링용 리스트
    setCurrentPage 
  };
};