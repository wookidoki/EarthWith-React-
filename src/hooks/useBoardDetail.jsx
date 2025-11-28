import { useState, useEffect } from 'react';
import { Sun, Car, ShoppingBag, Users, BookOpen, FileText } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081';

// 카테고리별 스타일 및 아이콘 매핑 (useBoardList와 동일한 로직)
const getCategoryStyle = (categoryCode) => {
  if (categoryCode?.startsWith('A1')) return { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' };
  if (categoryCode?.startsWith('A3')) return { icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('A5')) return { icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-100' };
  if (categoryCode?.startsWith('B2')) return { icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' };
  if (categoryCode?.startsWith('B1')) return { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-100' };
  return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
};

export const useBoardDetail = (id) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // 좋아요/북마크 상태 (현재는 로컬 상태, 추후 API 연동 필요)
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBoardDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/boards/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('게시글을 찾을 수 없습니다.');
          throw new Error('서버 통신 오류');
        }

        const data = await response.json();

        // 1. 게시글 데이터 매핑 (Back DTO -> Front State)
        const style = getCategoryStyle(data.boardCategory);
        const mappedPost = {
            id: data.boardNo,
            title: data.boardTitle,
            category: data.boardCategory, // 필요 시 카테고리 이름 변환 로직 추가
            content: data.boardContent,
            author: data.memberName,
            date: data.regDate,
            views: data.viewCount,
            icon: style.icon,
            color: style.color,
            // 이미지는 현재 DB에 없으므로 플레이스홀더 사용
            img: `https://placehold.co/800x400/e2e8f0/1e293b?text=${encodeURIComponent(data.boardCategory)}`
        };

        // 2. 댓글 데이터 매핑
        const mappedComments = (data.commentList || []).map(c => ({
            id: c.commentNo,
            author: c.memberName,
            text: c.commentContent,
            date: c.regDate
        }));

        setPost(mappedPost);
        setComments(mappedComments);
        setLikeCount(data.likeCount || 0);

      } catch (err) {
        console.error("상세 조회 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [id]);

  // --- 핸들러 (현재는 UI만 동작, 추후 API 연동 필요) ---

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    // [TODO] 백엔드 POST /comments API 호출 필요
    const tempComment = { 
        id: Date.now(), 
        author: '현재 사용자', // 로그인된 사용자 정보 필요
        text: newComment, 
        date: new Date().toISOString().split('T')[0] 
    };
    
    setComments([...comments, tempComment]); // 최신 댓글 뒤에 추가 (또는 앞에 추가)
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    // [TODO] 백엔드 DELETE /comments/{id} API 호출 필요
    if(window.confirm("댓글을 삭제하시겠습니까?")) {
        setComments(comments.filter(c => c.id !== commentId));
    }
  };

  const handleLike = () => {
    // [TODO] 백엔드 POST /boards/{id}/like API 호출 필요
    setIsLiked(!isLiked);
    setLikeCount(prev => prev + (isLiked ? -1 : 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(`게시물 링크가 클립보드에 복사되었습니다.`);
  };

  return {
    post,
    comments,
    newComment, setNewComment,
    isLiked, isBookmarked, likeCount,
    loading, error,
    handlers: {
      handleAddComment,
      handleDeleteComment,
      handleLike,
      handleBookmark,
      handleShare
    }
  };
};