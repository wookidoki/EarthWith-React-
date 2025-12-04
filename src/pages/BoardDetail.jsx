import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ThumbsUp, Share2, MessageSquare, Eye, XCircle, ArrowLeft, Send, 
    Loader2, Trash2, Edit, User, Calendar 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// [수정됨] 경로를 상위 폴더(..)로 나갔다가 hooks로 들어가도록 변경
import { useBoardDetail } from '../hooks/useBoardDetail';

// [헬퍼 함수] 카테고리 코드 스타일 매핑
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

// [내부 컴포넌트] 댓글 섹션
const CommentSection = ({ comments, newComment, setNewComment, onAdd, onDelete }) => (
    <div className="mt-8 pt-8 border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
            <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" /> 
            댓글 <span className="ml-1 text-emerald-600">{comments.length}</span>
        </h3>
        
        {/* 댓글 입력창 */}
        <div className="flex gap-3 mb-8">
            <textarea 
                className="flex-grow p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all placeholder-gray-400 text-sm" 
                rows="3" 
                placeholder="따뜻한 댓글을 남겨주세요..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
            />
            <button 
                onClick={onAdd} 
                className="flex-shrink-0 bg-emerald-600 text-white w-16 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition shadow-sm active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
            {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.commentNo} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 text-sm block">{comment.memberName}</span>
                                <span className="text-xs text-gray-400">{comment.regDate}</span>
                            </div>
                        </div>
                        <button onClick={() => onDelete(comment.commentNo)} className="text-gray-300 hover:text-red-500 transition p-1">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-10">{comment.commentContent}</p>
                </div>
            )) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                </div>
            )}
        </div>
    </div>
);

// [메인 컴포넌트] 게시글 상세
const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
    
    // 커스텀 훅 사용
    const { 
        post, comments, newComment, setNewComment, loading, error, 
        actions 
    } = useBoardDetail(id);

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
    // 1. 로그인 정보(auth.memberId)가 있고
    // 2. 게시글 작성자 정보(post.boardWriter)가 있으며
    // 3. 둘이 일치할 때만 true
    const isWriter = auth?.memberId && post?.boardWriter && (auth.memberId === post.boardWriter);
    
    // 카테고리 정보 가져오기
    const categoryInfo = getCategoryInfo(post.category);

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* 상단 네비게이션 */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/board')} className="flex items-center text-gray-500 hover:text-emerald-600 font-medium transition group">
                        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
                        목록
                    </button>
                    
                    {/* 작성자 본인일 경우에만 수정/삭제 버튼 노출 */}
                    {isWriter && (
                        <div className="flex gap-2">
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
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                    {post.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {post.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-gray-400" />
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

                    {/* 하단 버튼 (좋아요/공유) */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-red-500 hover:border-red-200 transition active:scale-95 group">
                            <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">좋아요</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-blue-500 hover:border-blue-200 transition active:scale-95 group">
                            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">공유하기</span>
                        </button>
                    </div>

                    {/* 댓글 섹션 */}
                    <div className="px-8 pb-10">
                        <CommentSection 
                            comments={comments} 
                            newComment={newComment} 
                            setNewComment={setNewComment} 
                            onAdd={() => actions.handleAddComment(auth.memberName)} 
                            onDelete={actions.handleDeleteComment} 
                        />
                    </div>
                </article>
            </main>
        </div>
    );
};

export default BoardDetail;