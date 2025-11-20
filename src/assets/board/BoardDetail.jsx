import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Share2, Bookmark, MessageSquare, Eye, XCircle, ArrowLeft, Send, Sun, Car, Droplet, ShoppingBag, Users, BookOpen } from 'lucide-react';
// ⭐ useAuth Import 제거 (오류 원인 가능성 제거)
// import { useAuth } from "../auth/authContext/AuthorContext.jsx"; 


// BoardPage에서 사용한 목업 데이터 (임시로 여기에 복사하여 사용)
const MOCK_POSTS_DATA = [
  { id: 1, title: '서울시, 친환경 에너지 보급 확대 정책 발표', category: '#A1 공공', content: '서울시는 2026년부터 모든 신축 건물에 고효율 태양광 패널 설치를 의무화하는 등 친환경 에너지 전환 정책을 대폭 강화한다고 밝혔다. 이는 탄소 중립 목표 달성을 위한 핵심 전략 중 하나로, 시민들의 적극적인 참여를 유도하기 위한 인센티브 제도도 마련될 예정이다.', author: '관리자A', date: '1일 전', views: 1204, icon: Sun, color: 'text-orange-500', img: 'https://placehold.co/600x400/f97316/white?text=에너지' },
  { id: 2, title: '겨울철 에너지 절약 캠페인 자원봉사자 모집', category: '#B2 모집', content: '지역 사회와 함께하는 겨울철 에너지 절약 캠페인에 참여할 자원봉사자를 모집합니다. 주요 활동 내용은 에너지 사용량 절감 가이드 배포 및 절약 우수 가구 선정입니다. 많은 관심 부탁드립니다.', author: '지역지킴이', date: '2일 전', views: 876, icon: Users, color: 'text-blue-500', img: 'https://placehold.co/600x400/3b82f6/white?text=모집' },
  { id: 3, title: '전기차 보조금 개편안 상세 안내 (2026년)', category: '#A3 자동차', content: '2026년 전기차 보조금 지급 기준이 대폭 변경됩니다. 특히, 차량 가격 상한선이 낮아지고 고성능 차량에 대한 지원이 축소될 예정입니다. 구매 전 반드시 확인하세요.', author: '관리자B', date: '2일 전', views: 2300, icon: Car, color: 'text-blue-600', img: 'https://placehold.co/600x400/2563eb/white?text=자동차' },
  { id: 4, title: '올바른 분리수거 가이드라인 v3.0 배포', category: '#B1 정보', content: '새로운 분리수거 지침이 발표되었습니다. 특히 폐건전지와 형광등 수거 방식에 변화가 있으니 자세한 내용은 첨부된 가이드라인을 확인해 주세요.', author: '환경부', date: '3일 전', views: 952, icon: Droplet, color: 'text-cyan-500', img: 'https://placehold.co/600x400/06b6d4/white?text=정보' },
  { id: 5, title: '‘용기내 챌린지’가 바꾼 우리 동네 가게들', category: '#A5 녹색소비', content: '용기내 챌린지 덕분에 우리 동네 마트 3곳이 제로 웨이스트 코너를 신설했습니다! 소비자 힘의 변화를 느껴보세요.', author: '챌린저', date: '4일 전', views: 1840, icon: ShoppingBag, color: 'text-green-500', img: 'https://placehold.co/600x400/22c55e/white?text=녹색소비' },
  { id: 6, title: '지역별 탄소중립포인트 우수 참여 사례집 배포', category: '#B1 정보', content: '지난해 포인트 우수 참여자들의 사례를 모아 사례집을 발간했습니다. 포인트를 모으는 다양한 팁과 노하우를 확인하세요.', author: '운영자', date: '5일 전', views: 730, icon: BookOpen, color: 'text-indigo-500', img: 'https://placehold.co/600x400/6366f1/white?text=정보' },
];

const MOCK_COMMENTS = [
    { id: 101, author: '환경사랑123', text: '좋은 정보 감사합니다! 바로 공유할게요.', date: '1시간 전' },
    { id: 102, author: '제로웨이스트', text: '지역 사회 참여 활동에 관심 있었는데 잘 됐네요!', date: '30분 전' },
];

const CommentSection = () => {
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        
        // TODO: (AXIOS) 서버에 댓글 추가 요청 로직
        const newId = Date.now();
        const comment = { 
            id: newId, 
            author: '현재 사용자', // useAuth()에서 가져와야 함
            text: newComment, 
            date: '방금 전' 
        };
        setComments([comment, ...comments]); // 최신 댓글을 상단에 표시
        setNewComment('');
    };

    const handleDeleteComment = (id) => {
        // TODO: (AXIOS) 서버에 댓글 삭제 요청 로직
        setComments(comments.filter(c => c.id !== id));
    };

    return (
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-5 border-b pb-3">
                <MessageSquare className="w-6 h-6 mr-2 text-blue-500" /> 댓글 ({comments.length})
            </h3>

            {/* 댓글 입력 폼 */}
            <div className="flex mb-6 space-x-3">
                <textarea
                    className="flex-grow p-3 border border-gray-300 rounded-xl resize-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="의견을 남겨주세요."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    onClick={handleAddComment}
                    className="flex-shrink-0 bg-blue-600 text-white w-14 h-14 rounded-xl flex items-center justify-center hover:bg-blue-700 transition"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{comment.author}</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{comment.date}</span>
                                {/* TODO: 현재 사용자만 삭제 버튼 보이도록 조건부 렌더링 필요 */}
                                <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500 transition">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BoardDetail = () => {
    const { id } = useParams(); // URL 파라미터에서 게시물 ID를 가져옵니다.
    const navigate = useNavigate();
    // const { isLoggedIn } = useAuth(); // Context 사용 주석 처리 유지
    
    // 현재 게시물 찾기 (실제로는 API 호출로 데이터를 가져와야 합니다.)
    const postId = parseInt(id);
    const post = MOCK_POSTS_DATA.find(p => p.id === postId);

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(post ? Math.floor(post.views * 0.1) : 0); // 예시 카운트

    if (!post) {
        return (
            <div className="min-h-screen p-8 flex justify-center items-center text-red-500">
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center">
                    <h1 className="text-2xl font-bold mb-3">404 - 게시물 없음</h1>
                    <p className="text-gray-600">요청하신 ID ({id})의 게시물을 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => prev + (isLiked ? -1 : 1));
        // TODO: (AXIOS) 서버에 좋아요 상태 변경 요청
    };

    const handleShare = () => {
        // TODO: 실제 공유 로직 (URL 복사, SNS 공유 등)
        console.log(`게시물 ${post.title} 공유 요청`);
        // Navigator.clipboard.writeText('...'); // 클립보드 복사 로직 추가 가능
        alert(`게시물 링크가 클립보드에 복사되었습니다: https://www.merriam-webster.com/dictionary/placeholder`); // alert 대신 커스텀 모달 사용 권장
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // TODO: (AXIOS) 서버에 북마크 상태 변경 요청
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            <main className="max-w-4xl mx-auto px-4 py-10">

                {/* 뒤로 가기 버튼 및 액션 헤더 */}
                <header className="flex justify-between items-center mb-8 border-b pb-4">
                    <button 
                        onClick={() => navigate(-1)} // 이전 페이지로 돌아가기
                        className="flex items-center text-gray-600 hover:text-emerald-600 font-medium transition"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> 목록으로 돌아가기
                    </button>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                            <Eye className="w-4 h-4" /> <span>{post.views}</span>
                        </span>
                    </div>
                </header>

                {/* 게시물 본문 영역 */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                    
                    {/* 제목 및 메타 정보 */}
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

                    {/* 이미지 및 내용 */}
                    {post.img && (
                        <div className="w-full max-h-96 rounded-xl overflow-hidden mb-6 shadow-md">
                            <img src={post.img} alt={post.title} className="w-full object-cover" />
                        </div>
                    )}
                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                        <p className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
                            #친환경 #탄소중립 #환경캠페인
                        </p>
                    </div>

                    {/* 좋아요/공유/북마크 버튼 */}
                    <div className="flex justify-center space-x-6 mt-10 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center space-x-2 p-3 rounded-full transition-all ${
                                isLiked 
                                ? 'bg-red-500 text-white shadow-lg transform scale-105' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <ThumbsUp className="w-6 h-6" />
                            <span className="font-bold">{likeCount.toLocaleString()}</span>
                        </button>
                        <button 
                            onClick={handleShare}
                            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"
                        >
                            <Share2 className="w-6 h-6" />
                            <span>공유</span>
                        </button>
                        <button 
                            onClick={handleBookmark}
                            className={`flex items-center space-x-2 p-3 rounded-full transition-all ${
                                isBookmarked 
                                ? 'bg-yellow-500 text-white shadow-lg transform scale-105' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Bookmark className="w-6 h-6" fill={isBookmarked ? 'white' : 'none'} />
                        </button>
                    </div>
                </div>

                /* 댓글 섹션 */
                <CommentSection />
                
            </main>
        </div>
    );
};

export default BoardDetail;