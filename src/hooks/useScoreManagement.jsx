import { useState } from 'react';

const initialPendingPosts = [
  { id: 1, author: '김환경', title: '플로깅 챌린지 성공 인증!', content: '쓰레기 5kg 주웠어요.', type: 'FEED', date: '2025-11-16', score: null },
  { id: 2, author: '에코맨', title: '친환경 세제 사용 후기', content: '거품도 잘나고 좋아요.', type: 'BOARD', date: '2025-11-17', score: null },
  // ...
];

export const useScoreManagement = () => {
  const [posts, setPosts] = useState(initialPendingPosts);
  const [selectedType, setSelectedType] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const filteredPosts = posts.filter(post => 
    selectedType === 'ALL' || post.type === selectedType
  );

  const handleTypeChange = (postId, currentType) => {
    const newType = currentType === 'FEED' ? 'BOARD' : 'FEED';
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, type: newType } : post
    ));
  };

  const handleScoreGrant = (postId, score) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, score: score } : post
    ));
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return {
    filteredPosts, selectedType, expandedId, posts,
    setSelectedType, toggleExpand,
    handleTypeChange, handleScoreGrant
  };
};