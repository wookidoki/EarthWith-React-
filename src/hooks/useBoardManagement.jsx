import { useState, useEffect } from 'react';

// 초기 목업 데이터
const initialItems = [
  { id: 1, type: 'POST', postId: 101, author: '김**철', title: '환경 미션 달성!', content: '나무를 심었어요!', dateCreated: '2025-11-10', isReported: true, status: 'Active' },
  { id: 2, type: 'REVIEW', postId: 205, author: '이**수', title: '친환경 제품 리뷰', content: '만족도 별 5개!', dateCreated: '2025-11-11', isReported: false, status: 'Active' },
  // ... (나머지 목업 데이터)
];

export const useBoardManagement = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedType, setSelectedType] = useState('POST'); 
  const [filterMode, setFilterMode] = useState('ALL'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // 데이터 페칭 시뮬레이션
  const fetchData = async (type, mode, search) => {
    // 실제로는 API 호출: await axios.get(...)
    let filtered = initialItems.filter(item => item.type === type);
    
    if (mode === 'REPORTED') {
      filtered = filtered.filter(item => item.isReported);
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowerSearch) || 
        item.content.toLowerCase().includes(lowerSearch)
      );
    }
    
    filtered.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    setItems(filtered);
  };

  useEffect(() => {
    fetchData(selectedType, filterMode, searchTerm);
  }, [selectedType, filterMode, searchTerm]);

  const handleConfirmReport = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isReported: false } : item
    ));
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Deleted' } : item
    ));
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchTerm('');
  };

  return {
    items, selectedType, filterMode, searchTerm, selectedItem,
    setFilterMode, setSearchTerm, setSelectedItem,
    handleTypeChange, handleConfirmReport, handleDeleteItem, fetchData
  };
};