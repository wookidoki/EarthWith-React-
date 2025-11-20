import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, XCircle, CheckCircle, MessageSquare, List } from 'lucide-react';

// --- 데이터 및 마스킹 로직 ---

// 목업 데이터 (게시글 및 리뷰 통합)



const initialItems = [
  
  { id: 1, type: 'POST', postId: 101, author: '김**철', title: '환경 미션 달성!', content: '나무를 심었어요!', dateCreated: '2025-11-10', isReported: true, status: 'Active' },
  { id: 2, type: 'REVIEW', postId: 205, author: '이**수', title: '친환경 제품 리뷰', content: '만족도 별 5개!', dateCreated: '2025-11-11', isReported: false, status: 'Active' },
  { id: 3, type: 'POST', postId: 312, author: '박**민', title: '관리자 공지', content: '게시판 이용 안내입니다.', dateCreated: '2025-11-12', isReported: true, status: 'Active' },
  { id: 4, type: 'POST', postId: 400, author: '최**지', title: '제로 웨이스트 후기', content: '챌린지 성공!', dateCreated: '2025-11-13', isReported: false, status: 'Active' },
  { id: 5, type: 'REVIEW', postId: 550, author: '정**영', title: '문의글 리뷰', content: '응대 빨라요!', dateCreated: '2025-11-14', isReported: true, status: 'Deleted' },
  { id: 6, type: 'POST', postId: 601, author: '황**진', title: '자전거 출퇴근', content: '탄소 절약 중입니다.', dateCreated: '2025-11-09', isReported: false, status: 'Active' },
  { id: 7, type: 'REVIEW', postId: 700, author: '강**호', title: '배송 리뷰', content: '빠른 배송 감사합니다.', dateCreated: '2025-11-08', isReported: false, status: 'Active' },
   
];


const ITEMS_PER_PAGE = 5;

// --- 목록 테이블 컴포넌트 ---
const ItemTable = ({ items, onConfirmReport, onDeletePost, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이징 처리
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderPaginationButtons = () => {
    const pageGroup = Math.ceil(currentPage / 10);
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    const buttons = [];

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition ${
            currentPage === i 
              ? 'bg-emerald-600 text-white font-bold shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-emerald-50">
          <tr>
            {['구분', '번호', '작성자', '제목/내용', '작성일', '신고 여부', '상태', '액션'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((item) => (
            <tr key={item.id} className="hover:bg-yellow-50 transition duration-150 cursor-pointer" onClick={() => onRowClick(item)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.type === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {item.type === 'POST' ? '게시글' : '리뷰'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.postId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.author}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateCreated}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.isReported ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" title="신고 접수됨" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-gray-300" title="정상" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'Active' ? '활성' : '삭제됨'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeletePost(item.id); }}
                    className="p-1.5 rounded-full text-red-600 hover:bg-red-100 transition"
                    title="영구 삭제"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  {item.isReported && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onConfirmReport(item.id); }}
                      className="p-1.5 rounded-full text-emerald-600 hover:bg-emerald-100 transition"
                      title="신고 확인 처리"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                조회된 항목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center py-4 bg-white rounded-b-xl">
        {/* 이전 페이지 버튼 */}
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
          className="p-2 mx-1 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {renderPaginationButtons()}
        {/* 다음 페이지 버튼 */}
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={currentPage === totalPages}
          className="p-2 mx-1 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- 메인 컴포넌트 ---
const PostReviewManagement = () => {
  // 초기값은 POST (게시글)로 설정하여 SELECT ALL 기능 제거 반영
  const [items, setItems] = useState(initialItems);
  const [selectedType, setSelectedType] = useState('POST'); // POST 또는 REVIEW만 선택 가능
  const [filterMode, setFilterMode] = useState('ALL'); // ALL, REPORTED
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // 모달 상세 정보

  // AJAX 플레이스홀더: API 호출 및 데이터 갱신
  const fetchData = async (type, mode, search) => {
    console.log(`[AJAX] 데이터 요청: 유형=${type}, 모드=${mode}, 검색어=${search}`);
    
    // Mock 데이터 필터링 (type은 이제 항상 POST 또는 REVIEW)
    let filtered = initialItems.filter(item => item.type === type);
    
    if (mode === 'REPORTED') {
      filtered = filtered.filter(item => item.isReported);
    }
    
    // 검색어 필터링 (제목/내용)
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowerSearch) || 
        item.content.toLowerCase().includes(lowerSearch)
      );
    }
    
    // 최신순으로 정렬 (목업 데이터이므로 dateCreated 기준)
    filtered.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    setItems(filtered);
  };

  // 필터 변경 시 데이터 재요청
  React.useEffect(() => {
    // selectedType이 변경되면 filterMode를 ALL로 초기화하는 것이 일반적이지만,
    // 여기서는 기존 필터 모드를 유지하고 데이터만 다시 가져옵니다.
    fetchData(selectedType, filterMode, searchTerm);
  }, [selectedType, filterMode, searchTerm]); // searchTerm도 변경될 때마다 재요청

  // 게시글/리뷰 타입 변경 핸들러
  const handleTypeChange = (type) => {
      setSelectedType(type);
      setSearchTerm(''); // 타입 변경 시 검색어 초기화 (새로운 SELECT BY)
  };


  // 신고 확인 처리 (신고 상태를 false로 변경)
  const handleConfirmReport = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isReported: false } : item
    ));
    // 실제 서버 업데이트 로직 필요
    console.log(`ID ${id} 신고 확인 처리됨.`);
  };

  // 게시글/리뷰 삭제 (상태를 'Deleted'로 변경)
  const handleDeleteItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'Deleted' } : item
    ));
    // 실제 서버 업데이트 로직 필요
    console.log(`ID ${id} 삭제 요청 처리됨.`);
  };

  // 검색 실행 (SELECT BY)
  const handleSearch = () => {
    // useEffect가 searchTerm 변경을 감지하고 fetchData를 호출하므로 추가적인 호출이 필요 없을 수 있으나,
    // 명시적인 검색 버튼 클릭 시에도 실행되도록 유지합니다.
    fetchData(selectedType, filterMode, searchTerm); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-12 py-10">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-4 flex items-center">
            <List className="w-7 h-7 mr-2 text-emerald-500" /> 게시글 및 리뷰 관리
          </h1>
          <p className="text-gray-500 mt-2">
            게시글과 리뷰를 조회하고 관리하며, 신고 내역을 처리할 수 있습니다.
          </p>
        </header>

        {/* 필터 영역 */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
          <div className="flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* 1. 게시글/리뷰 선택 (SELECT TYPE) */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTypeChange('POST')}
                className={`py-2 px-4 rounded-lg font-semibold transition ${selectedType === 'POST' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                게시글 조회
              </button>
              <button 
                onClick={() => handleTypeChange('REVIEW')}
                className={`py-2 px-4 rounded-lg font-semibold transition ${selectedType === 'REVIEW' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                리뷰 조회
              </button>
            </div>
            
            {/* 2. 신고 필터 */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterMode('ALL')}
                className={`py-2 px-4 rounded-lg font-semibold transition ${filterMode === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                전체 항목 조회
              </button>
              <button 
                onClick={() => setFilterMode('REPORTED')}
                className={`py-2 px-4 rounded-lg font-semibold transition ${filterMode === 'REPORTED' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <AlertTriangle className="w-4 h-4 inline mr-1" /> 신고된 것만 조회
              </button>
            </div>

          </div>

          {/* 3. 검색 입력 (SELECT BY) */}
          <div className="flex pt-4">
            <input
              type="text"
              placeholder="제목, 작성자, 내용으로 검색 (SELECT BY)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-700 text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition flex items-center space-x-1"
            >
              <Search className="w-5 h-5" />
              <span>검색</span>
            </button>
          </div>
          
        </section>

        {/* 게시글/리뷰 목록 테이블 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedType === 'POST' ? '게시글' : '리뷰'} 목록 ({items.length}건)</h2>
          <ItemTable 
            items={items}
            onConfirmReport={handleConfirmReport}
            onDeletePost={handleDeleteItem}
            onRowClick={setSelectedItem}
          />
        </section>

        {/* 상세 모달 */}
        <ItemDetailModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </div>
  );
};

// --- 상세 모달 컴포넌트 (재사용) ---
const ItemDetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            {item.type === 'POST' ? <List className="w-5 h-5 mr-2 text-blue-600" /> : <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />}
            {item.type === 'POST' ? '게시글 상세' : '리뷰 상세'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p><strong>번호:</strong> {item.postId}</p>
          <p><strong>제목:</strong> {item.title}</p>
          <p><strong>작성자:</strong> {item.author}</p>
          <p><strong>작성일:</strong> {item.dateCreated}</p>
          <p><strong>신고 여부:</strong> {item.isReported ? <span className="text-red-500 font-bold">신고됨</span> : '정상'}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold mb-2">상세 내용:</h4>
            <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
              {item.content}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button 
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReviewManagement;