import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Share2, Bookmark, MessageSquare, Eye, XCircle, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useBoardDetail } from '../hooks/useBoardDetail';
import CommentSection from '../components/board/CommentSection';

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Hook 사용 (로딩, 에러 상태 추가됨)
    const { 
        post, comments, newComment, setNewComment, 
        isLiked, isBookmarked, likeCount, 
        handlers, loading, error 
    } = useBoardDetail(id);

    // 로딩 중 표시
    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
    );

    // 에러 발생 시 표시
    if (error) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-red-500">
            <p className="text-xl font-bold mb-4">⚠️ {error}</p>
            <button onClick={() => navigate('/board')} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
                목록으로 돌아가기
            </button>
        </div>
    );

    if (!post) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            <main className="max-w-4xl mx-auto px-4 py-10">
                
                {/* 상단 네비게이션 */}
                <header className="flex justify-between items-center mb-8 border-b pb-4">
                    <button onClick={() => navigate('/board')} className="flex items-center text-gray-600 hover:text-emerald-600 font-medium transition">
                        <ArrowLeft className="w-5 h-5 mr-2" /> 목록으로 돌아가기
                    </button>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                            <Eye className="w-4 h-4" /> <span>{post.views}</span>
                        </span>
                    </div>
                </header>

                {/* 본문 영역 */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${post.color} ${post.color.replace('text-', 'bg-').replace('500', '100')}`}>
                            {post.category}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 border-t pt-2 mt-4">
                            <span>작성자: <span className="font-medium text-gray-700">{post.author}</span></span>
                            <span>작성일: {post.date}</span>
                        </div>
                    </div>

                    {/* 이미지 영역 (DB에 이미지가 없어도 카테고리 기반 플레이스홀더 출력) */}
                    <div className="w-full max-h-96 rounded-xl overflow-hidden mb-6 shadow-md bg-gray-100 flex items-center justify-center">
                         <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                    </div>

                    {/* 내용 영역 */}
                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                        {post.content}
                    </div>

                    {/* 태그 (하드코딩 예시, 필요 시 DB 태그 연동) */}
                    <p className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600 font-medium">
                        #친환경 #탄소중립 #환경캠페인 #{post.category}
                    </p>

                    {/* 액션 버튼 (좋아요, 공유, 북마크) */}
                    <div className="flex justify-center space-x-6 mt-10 pt-6 border-t border-gray-200">
                        <button onClick={handlers.handleLike} className={`flex items-center space-x-2 p-3 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <ThumbsUp className="w-6 h-6" />
                            <span className="font-bold">{likeCount.toLocaleString()}</span>
                        </button>
                        <button onClick={handlers.handleShare} className="flex items-center space-x-2 p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition">
                            <Share2 className="w-6 h-6" />
                            <span>공유</span>
                        </button>
                        <button onClick={handlers.handleBookmark} className={`flex items-center space-x-2 p-3 rounded-full transition-all ${isBookmarked ? 'bg-yellow-500 text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <Bookmark className="w-6 h-6" fill={isBookmarked ? 'white' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* 댓글 영역 */}
                <CommentSection 
                    // [핵심 수정 1] URL에서 가져온 id를 boardNo라는 이름으로 넘겨줌
                    boardNo={id} 
                    
                    // [핵심 수정 2] CommentSection은 'commentList'라는 이름을 원함
                    commentList={comments} 
                    
                    // [핵심 수정 3] 데이터 갱신을 위해 새로고침 함수 전달 (임시로 페이지 리로드)
                    onRefresh={() => window.location.reload()} 
                />
            </main>
        </div>
    );
};

export default BoardDetail;