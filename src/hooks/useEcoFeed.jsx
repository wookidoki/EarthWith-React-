import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // AuthContext 경로 주의

export const useEcoFeed = () => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all', 'popular', 'recruit'
  const [loading, setLoading] = useState(false);

  // 초기 데이터 (더미)
  const initialFeedData = [
    {
      id: 1,
      category: '#C2 참여',
      title: '주말 한강공원 플로깅 참여자 모집!',
      content: '이번 주 토요일 오후 2시, 여의도 한강공원에서 함께 쓰레기를 주우실 분들을 모집합니다.',
      imageUrl: 'https://placehold.co/600x400/a0e9b0/333?text=Plogging+Event',
      tags: ['#플로깅', '#한강공원', '#자원봉사'],
      likes: 128,
      comments: 1, 
      participants: 22,
      maxParticipants: 50,
      isLiked: false, 
      isCommentOpen: false,
      commentsList: [ 
        { id: 'c1-1', user: '에코프렌드', text: '저도 참여하고 싶어요!' }
      ],
      newCommentText: '',
    },
    {
      id: 2,
      category: '#C1 인증',
      title: '오늘부터 텀블러 사용 1일차',
      content: '회사에서 일회용컵 대신 텀블러를 사용하기 시작했습니다. 작은 실천이지만 뿌듯하네요!',
      imageUrl: 'https://placehold.co/600x600/b0c4de/333?text=My+Tumbler',
      tags: ['#텀블러인증', '#제로웨이스트'],
      likes: 245,
      comments: 0,
      isLiked: false,
      isCommentOpen: false,
      commentsList: [],
      newCommentText: '',
    },
  ];

  const [feedData, setFeedData] = useState(initialFeedData);

  // 좋아요 토글
  const handleLikeToggle = (postId) => {
    setFeedData(prevFeed =>
      prevFeed.map(post => {
        if (post.id === postId) {
          const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
          return { ...post, isLiked: !post.isLiked, likes: newLikes };
        }
        return post;
      })
    );
  };

  // 댓글창 토글
  const handleCommentToggle = (postId) => {
    setFeedData(prevFeed =>
      prevFeed.map(post =>
        post.id === postId ? { ...post, isCommentOpen: !post.isCommentOpen } : post
      )
    );
  };

  // 댓글 입력 핸들러
  const handleNewCommentChange = (postId, text) => {
    setFeedData(prevFeed =>
      prevFeed.map(post =>
        post.id === postId ? { ...post, newCommentText: text } : post
      )
    );
  };

  // 댓글 등록 핸들러
  const handleCommentSubmit = (postId) => {
    const post = feedData.find(p => p.id === postId);
    if (!post || post.newCommentText.trim() === '') return;

    const newComment = {
      id: `c${Date.now()}`,
      user: currentUser?.name || '익명',
      text: post.newCommentText,
    };

    setFeedData(prevFeed =>
      prevFeed.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsList: [...p.commentsList, newComment], 
            comments: p.comments + 1,
            newCommentText: '', 
          };
        }
        return p;
      })
    );
  };

  // 무한 스크롤 시뮬레이션
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading) {
        setLoading(true);
        setTimeout(() => {
          const newPostId = feedData.length + 1;
          const newPosts = [
            {
              id: newPostId,
              category: '#C1 인증',
              title: `새로 로드된 피드 ${newPostId}`,
              content: '무한 스크롤 테스트 데이터입니다.',
              imageUrl: 'https://placehold.co/600x300/f0a0a0/333?text=New+Post',
              tags: ['#무한스크롤', '#테스트'],
              likes: 10,
              comments: 0,
              isLiked: false,
              isCommentOpen: false,
              commentsList: [],
              newCommentText: '',
            }
          ];
          setFeedData(prevData => [...prevData, ...newPosts]);
          setLoading(false);
        }, 1500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, feedData]);

  // 필터링된 데이터 반환
  const filteredFeed = feedData.filter(post => {
    if (filter === 'popular') return post.likes > 100;
    if (filter === 'recruit') return post.category === '#C2 참여';
    return true;
  });

  return {
    filteredFeed,
    filter,
    setFilter,
    loading,
    handlers: {
      handleLikeToggle,
      handleCommentToggle,
      handleNewCommentChange,
      handleCommentSubmit
    }
  };
};