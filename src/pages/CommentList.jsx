import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, CornerDownRight, ChevronLeft, ChevronRight } from 'lucide-react';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const memberNo = localStorage.getItem('memberNo');
      const response = await fetch(
        `http://localhost:8081/members/comments?memberNo=${memberNo}&page=${currentPage}`
      );
      const data = await response.json();
      
      setComments(data.list || []);
      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      // 임시 데이터 (테스트용)
      setComments([
        {
          commentNo: 1,
          commentContent: '정말 유익한 정보네요! 저도 한번 도전해보겠습니다.',
          regDate: '2024.12.01',
          boardNo: 10,
          boardTitle: '제로웨이스트 도전 후기'
        },
        {
          commentNo: 2,
          commentContent: '좋은 제품 추천 감사합니다. 구매해봐야겠어요.',
          regDate: '2024.11.30',
          boardNo: 15,
          boardTitle: '친환경 제품 추천'
        },
        {
          commentNo: 3,
          commentContent: '이런 활동이 많아졌으면 좋겠네요 👍',
          regDate: '2024.11.29',
          boardNo: 8,
          boardTitle: '지역 환경 정화 활동'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = (boardNo) => {
    navigate(`/board/${boardNo}`);
  };

  const formatDate = (dateString) => {
    return dateString || '날짜 없음';
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">로딩 중...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">작성한 댓글이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <>
          {/* 댓글 리스트 */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.commentNo}
                onClick={() => handleCommentClick(comment.boardNo)}
                className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white">
                
                {/* 원글 제목 */}
                <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-100">
                  <CornerDownRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">댓글 단 게시글:</span>
                  <span className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                    {comment.boardTitle || '제목 없음'}
                  </span>
                </div>
                
                {/* 댓글 내용 */}
                <div className="mb-3">
                  <p className="text-gray-800 leading-relaxed">
                    {comment.commentContent}
                  </p>
                </div>
                
                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(comment.regDate)}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentClick(comment.boardNo);
                    }}
                    className="text-blue-500 hover:text-blue-700 font-medium text-xs flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-blue-50 transition-all">
                    <span>원글 보기</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 페이징 */}
          {pageInfo && pageInfo.maxPage > 0 && (
            <div className="flex justify-center items-center space-x-2 pt-6">
              {/* 처음 버튼 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 이전 버튼 */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                이전
              </button>

              {/* 페이지 번호 */}
              {[...Array(pageInfo.endPage - pageInfo.startPage + 1)].map((_, i) => {
                const pageNum = pageInfo.startPage + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {pageNum}
                  </button>
                );
              })}

              {/* 다음 버튼 */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageInfo.maxPage}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                다음
              </button>

              {/* 끝 버튼 */}
              <button
                onClick={() => setCurrentPage(pageInfo.maxPage)}
                disabled={currentPage === pageInfo.maxPage}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 페이지 정보 표시 */}
          {pageInfo && (
            <div className="text-center text-sm text-gray-500 pt-2">
              전체 {pageInfo.listCount}개 중 {((currentPage - 1) * pageInfo.boardLimit) + 1} - {Math.min(currentPage * pageInfo.boardLimit, pageInfo.listCount)}개
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;