import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBoardEnroll = (isAdmin) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  
  const handleSubmit = async () => {
    // 유효성 검사 및 API 호출 로직
    const payload = { title, content, category: selectedCategory };
    console.log('Submit:', payload);
    
    // 성공 시
    alert('게시글이 등록되었습니다.');
    navigate('/board');
  };

  return {
    title, setTitle,
    content, setContent,
    selectedCategory, handleCategoryChange,
    handleSubmit
  };
};