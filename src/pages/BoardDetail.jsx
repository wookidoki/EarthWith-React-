import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ThumbsUp, Loader2, Trash2, Edit, User, Calendar, ArrowLeft,
    Bookmark, Flag, X, MessageSquare
} from 'lucide-react';
// 훅과 Context를 분리된 파일에서 가져옵니다. (경로 유지)
import { useAuth } from '../context/AuthContext'; 
import { useBoardDetail } from '../hooks/useBoardDetail'; 


// [헬퍼 함수] 카테고리 코드 스타일 매핑 (컴포넌트 렌더링용)
const getCategoryInfo = (code) => {
    const map = {
        'A1': { label: '공공', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        'A2': { label: '에너지', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        'A3': { label: '자동차', color: 'bg-slate-100 text-slate-700 border-slate-200' },
        'A4': { label: '일상생활', color: 'bg-green-100 text-green-700 border-green-200' },
        'A5': { label: '녹색소비', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        'B1': { label: '정보', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        'B2': { label: '모집', color: 'bg-rose-100 text-rose-700 border-rose-200' },
        'B3': { label: '홍보', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    };
    return map[code] || { label: '기타', color: 'bg-gray-100 text-gray-600 border-gray-200' };
};


// [CommentSection 대체 컴포넌트] (경로 오류 회피를 위해 이 파일 내에 정의)
const CommentSection = ({ 
    boardNo, commentList, 
    onNewCommentChange, // <<<<<<< 이 prop이 제대로 받아와졌는지 확인 완료
    onCommentSubmit, 
    onCommentEditInit, onCommentEditCancel, 
    onCommentDelete, onCommentReportSubmit, 
    newCommentText, editingCommentId
}) => {
    const isEditing = !!editingCommentId;
    const isNewCommentEmpty = newCommentText.trim() === "";
    
    // AuthContext의 memberId를 가져오는 임시 로직
    const useAuth = () => {
        const memberId = localStorage.getItem('memberId') || 'guest';
        return { auth: { memberId: memberId } };
    };
    const { auth } = useAuth();
    const currentUserId = auth?.memberId || 'guest';

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-600" /> 댓글 <span className="text-emerald-600">({commentList.length})</span>
            </h2>
            
            {/* 댓글 목록 */}
            <div className="space-y-4">
                {commentList.map(comment => {
                    const isCommentWriter = currentUserId === comment.memberId;
                    
                    const displayDate = comment.regDate ? comment.regDate.substring(0, 10) : '날짜 미상';

                    return (
                        <div key={comment.commentNo} className="flex flex-col border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={comment.memberImage} 
                                        alt="프사" 
                                        className="w-8 h-8 rounded-full object-cover" 
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{comment.memberName || comment.memberId}</p>
                                        <p className="text-gray-700">{comment.commentContent}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 text-sm text-gray-500 flex-shrink-0">
                                    {isCommentWriter ? (
                                        <>
                                            <button 
                                                onClick={() => onCommentEditInit(comment.commentNo, comment.commentContent)} 
                                                className="text-blue-500 hover:underline"
                                            >
                                                수정
                                            </button>
                                            <button 
                                                onClick={() => onCommentDelete(comment.commentNo)} 
                                                className="text-red-500 hover:underline"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => onCommentReportSubmit(comment.commentNo)} 
                                            className="text-gray-400 hover:text-red-400"
                                        >
                                            신고
                                        </button>
                                    )}
                                </div>
                            </div>
                            <small className="text-xs text-gray-400 mt-1 self-end">{displayDate}</small>
                        </div>
                    );
                })}
            </div>
            
            {/* 댓글 입력/수정 폼 */}
            <div className="pt-4 border-t border-gray-100">
                <textarea 
                    value={newCommentText} 
                    // [오류 해결 로직] onNewCommentChange는 (value) => {} 형태의 함수를 prop으로 받습니다.
                    onChange={(e) => {
                         // null/undefined 체크: prop이 없으면 아무것도 하지 않습니다.
                         if (typeof onNewCommentChange === 'function') {
                            onNewCommentChange(e.target.value);
                         } else {
                            console.error('onNewCommentChange prop이 함수가 아닙니다.');
                         }
                    }} 
                    placeholder={editingCommentId ? "댓글 수정 중..." : "댓글을 입력하세요..."}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows={editingCommentId ? 3 : 2}
                />
                <div className="flex justify-end gap-2 mt-2">
                    {editingCommentId && (
                        <button onClick={onCommentEditCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">취소</button>
                    )}
                    <button 
                        onClick={onCommentSubmit} 
                        disabled={isNewCommentEmpty}
                        className={`px-4 py-2 text-white rounded-lg transition ${isNewCommentEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {editingCommentId ? '수정 완료' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// [신고 모달 컴포넌트]
const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [reasonCode, setReasonCode] = useState("1");
    const [content, setContent] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!content.trim()) {
            window.alert("신고 내용을 입력해주세요."); 
            return;
        }
        onSubmit(reasonCode, content); 
        setContent("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" />신고하기
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">신고 사유</label>
                        <select 
                            value={reasonCode} 
                            onChange={(e) => setReasonCode(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                        >
                            <option value="1">부적절한 게시글 (욕설/비방)</option>
                            <option value="2">도배 및 중복 게시물</option>
                            <option value="3">광고 및 홍보성 게시물</option>
                            <option value="4">허위 사실 유포</option>
                            <option value="5">기타 사유</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="신고 사유를 상세히 적어주세요. (필수)"
                            className="w-full p-3 h-32 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 resize-none"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition shadow-md">
                        신고 접수
                    </button>
                </div>
            </div>
        </div>
    );
};


// [메인 컴포넌트] 게시글 상세
const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    
    const [isReportOpen, setIsReportOpen] = useState(false);

    // useBoardDetail 훅 호출
    const { 
        post, comments, loading, error, 
        actions, newComment, setNewComment, editingCommentId,
    } = useBoardDetail(id);

    const [isCommentReportOpen, setIsCommentReportOpen] = useState(false);
    const [targetCommentId, setTargetCommentId] = useState(null);

    // 로딩 중 표시
    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        </div>
    );

    // 에러 발생 또는 데이터 없음 표시
    if (error || !post) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500">
            <p className="text-lg font-medium mb-4">{error || "게시글이 존재하지 않습니다."}</p>
            <button onClick={() => navigate('/board')} className="px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition">
                목록으로 돌아가기
            </button>
        </div>
    );

    // [본인 확인 로직]
    const isWriter = auth?.memberId && post?.boardWriter && (auth.memberId === post.boardWriter);
    
    // 카테고리 정보 가져오기
    const categoryInfo = getCategoryInfo(post.category);
    
    // 댓글 신고 모달 열기 핸들러 (UI -> Hook action 연결)
    const openCommentReportModal = (commentId) => {
        setTargetCommentId(commentId);
        setIsCommentReportOpen(true);
    };

    // 댓글 신고 제출 핸들러 (Hook action에 연결)
    const handleCommentReportSubmit = (reasonCode, content) => {
        if (targetCommentId) {
            actions.handleCommentReportSubmit(targetCommentId, reasonCode, content);
        }
        setTargetCommentId(null);
        setIsCommentReportOpen(false);
    };


    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* 상단 네비게이션 */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/board')} className="flex items-center text-gray-500 hover:text-emerald-600 font-medium transition group">
                        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
                        목록
                    </button>
                    
                    <div className="flex gap-2">
                        {/* 작성자 본인일 경우: 수정/삭제 */}
                        {isWriter ? (
                            <>
                                <button 
                                    onClick={() => navigate('/board-enroll', { state: { mode: 'edit', postData: post } })} 
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                                >
                                    <Edit className="w-4 h-4 mr-1.5" /> 수정
                                </button>
                                <button 
                                    onClick={actions.deletePost} 
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" /> 삭제
                                </button>
                            </>
                        ) : (
                            /* 작성자가 아닐 경우: 신고 버튼 */
                            <button 
                                onClick={() => setIsReportOpen(true)}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="게시글 신고"
                            >
                                <Flag className="w-4 h-4 mr-1" /> 신고
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    {/* 게시글 헤더 */}
                    <div className="p-8 pb-6 border-b border-gray-50">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${categoryInfo.color}`}>
                            {categoryInfo.label}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden">
                                        {/* 프로필 이미지가 있다면 표시, 없으면 기본 아이콘 */}
                                        {post.memberImage ? (
                                            <img src={post.memberImage} alt="프사" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                    {post.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {post.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">조회수</span>
                                <span>{post.views}</span>
                            </div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div className="p-8">
                        {/* 이미지가 있을 경우에만 표시 */}
                        {post.img && (
                            <div className="mb-8 rounded-xl overflow-hidden shadow-md bg-gray-50 border border-gray-100">
                                <img 
                                    src={post.img} 
                                    alt="첨부 이미지" 
                                    className="w-full h-auto max-h-[600px] object-contain mx-auto" 
                                />
                            </div>
                        )}
                        <div className="text-gray-700 leading-8 text-lg whitespace-pre-wrap min-h-[150px]">
                            {post.content}
                        </div>
                    </div>

                    {/* 하단 버튼 (좋아요/북마크) */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
                        {/* 좋아요 버튼 (isLiked 상태에 따라 스타일 변경) */}
                        <button 
                            onClick={actions.handleLikeToggle}
                            className={`flex items-center gap-2 px-6 py-3 border rounded-full shadow-sm transition active:scale-95 group ${
                                post.isLiked 
                                ? 'bg-red-50 border-red-200 text-red-500' 
                                : 'bg-white border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200'
                            }`}
                        >
                            <ThumbsUp className={`w-5 h-5 group-hover:scale-110 transition-transform ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="font-bold">{post.likes}</span>
                        </button>

                        {/* 북마크 버튼 (isBookmarked 상태에 따라 스타일 변경) */}
                        <button 
                            onClick={actions.handleBookmarkToggle}
                            className={`flex items-center gap-2 px-6 py-3 border rounded-full shadow-sm transition active:scale-95 group ${
                                post.isBookmarked 
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-500' 
                                : 'bg-white border-gray-200 text-gray-600 hover:text-yellow-500 hover:border-yellow-200'
                            }`}
                        >
                            <Bookmark className={`w-5 h-5 group-hover:scale-110 transition-transform ${post.isBookmarked ? 'fill-current' : ''}`} />
                            <span className="font-bold">저장</span>
                        </button>
                    </div>
                </article>

                {/* 댓글 영역 */}
                <CommentSection 
                    boardNo={id} 
                    commentList={comments} 
                    onNewCommentChange={setNewComment} 
                    onCommentSubmit={actions.handleCommentSubmit}
                    onCommentEditInit={actions.handleCommentEditInit}
                    onCommentEditCancel={actions.handleCommentEditCancel}
                    onCommentDelete={actions.handleDeleteComment}
                    onCommentReportSubmit={openCommentReportModal} // 신고 모달 열기 핸들러 연결
                    newCommentText={newComment}
                    editingCommentId={editingCommentId}
                />

            </main>

            {/* 게시글 신고하기 모달 */}
            <ReportModal 
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                onSubmit={actions.handleReportSubmit}
            />

            {/* 댓글 신고하기 모달 */}
            <ReportModal 
                isOpen={isCommentReportOpen}
                onClose={() => setIsCommentReportOpen(false)}
                onSubmit={handleCommentReportSubmit}
            />
        </div>
    );
};

export default BoardDetail;