import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ThumbsUp, Share2, Loader2, Trash2, Edit, User, Calendar, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBoardDetail } from '../hooks/useBoardDetail';

// [변경됨] 서버측 변경사항 반영: 댓글 컴포넌트를 외부에서 가져옵니다.
import CommentSection from '../components/board/CommentSection';

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

// [메인 컴포넌트] 게시글 상세
const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
    
    // 커스텀 훅 사용
    const { 
        post, comments, loading, error, 
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
                </article>

                {/* 댓글 영역 (분리된 컴포넌트 사용) */}
                <CommentSection 
                    boardNo={id} 
                    commentList={comments} 
                    onRefresh={() => window.location.reload()} 
                />
            </main>
        </div>
    );
};

export default BoardDetail;