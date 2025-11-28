import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Send, Bookmark, Users, PlusSquare, Hash, Activity, ThumbsUp
} from 'lucide-react';
import { useEcoFeed } from '../hooks/useEcoFeed'; // Hook Import

const EcoFeedPage = () => {
  const navigate = useNavigate();
  const { 
    filteredFeed, filter, setFilter, loading, handlers 
  } = useEcoFeed();

  const { 
    handleLikeToggle, handleCommentToggle, 
    handleNewCommentChange, handleCommentSubmit 
  } = handlers;

  // UI 헬퍼 함수들
  const getCategoryStyle = (category) => {
    const styles = {
      '#C1 인증': 'bg-blue-100 text-blue-800',
      '#C2 참여': 'bg-emerald-100 text-emerald-800',
      '#C3 후기': 'bg-purple-100 text-purple-800',
      '#C4 자유': 'bg-gray-100 text-gray-800',
    };
    return styles[category] || styles['#C4 자유'];
  };

  const getSubNavStyle = (navFilter) => 
    filter === navFilter
      ? 'border-emerald-500 text-emerald-600 font-bold'
      : 'border-transparent text-gray-500 hover:text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* 상단 통계 섹션 (간소화) */}
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">실시간 우리지역 활동</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* 인기 태그 */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                <Hash className="w-5 h-5" /> <span className="text-sm font-medium">인기 태그</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">#플로깅</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">#텀블러인증</span>
              </div>
            </div>
            {/* 참여 현황 */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                <Activity className="w-5 h-5" /> <span className="text-sm font-medium">참여 현황</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm text-gray-700">진행중인 모집</span><span className="text-sm font-bold text-emerald-600">12 건</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-700">오늘의 참여</span><span className="text-sm font-bold text-emerald-600">45 명</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 글쓰기 버튼 */}
      <button
        onClick={() => navigate('/user-enroll')}
        className="fixed bottom-28 right-6 md:right-10 z-40 flex items-center space-x-2 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-xl"
      >
        <PlusSquare className="w-5 h-5" />
        <span className="hidden md:inline">글쓰기</span>
      </button>

      {/* 필터 탭 */}
      <div className="sticky top-20 bg-white/80 backdrop-blur-md z-30 border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex">
          {['all', 'popular', 'recruit'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 text-center text-sm border-b-2 transition-all ${getSubNavStyle(f)}`}
            >
              {f === 'all' ? '전체' : f === 'popular' ? '인기글' : '참여모집'}
            </button>
          ))}
        </div>
      </div>
      
      {/* 피드 리스트 */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {filteredFeed.map((post) => (
          <article key={post.id} className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-5">
              <div className="mb-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryStyle(post.category)}`}>
                  {post.category.substring(3)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
            </div>

            {post.imageUrl && (
              <div className="w-full bg-gray-200">
                <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
              </div>
            )}

            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-sm text-emerald-600 font-medium cursor-pointer hover:underline">{tag}</span>
                ))}
              </div>

              {post.category === '#C2 참여' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">참여 현황: {post.participants} / {post.maxParticipants} 명</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-2">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(post.participants / post.maxParticipants) * 100}%` }}></div>
                    </div>
                  </div>
                  <button className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all">참여하기</button>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <div className="flex space-x-5">
                  <button className="flex items-center space-x-1.5 text-gray-500 hover:text-emerald-600 transition-colors"><Send className="w-5 h-5" /><span className="text-sm font-medium">공유</span></button>
                  <button className="flex items-center space-x-1.5 text-gray-500 hover:text-emerald-600 transition-colors"><Bookmark className="w-5 h-5" /><span className="text-sm font-medium">북마크</span></button>
                </div>
                <div className="flex space-x-5">
                  <button onClick={() => handleLikeToggle(post.id)} className={`flex items-center space-x-1.5 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                    <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} /> <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button onClick={() => handleCommentToggle(post.id)} className={`flex items-center space-x-1.5 transition-colors ${post.isCommentOpen ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}>
                    <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>

            {post.isCommentOpen && (
              <div className="border-t border-gray-200 px-5 py-4 bg-gray-50/50">
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                  {post.commentsList.map(comment => (
                    <div key={comment.id} className="flex space-x-2">
                      <span className="font-bold text-sm text-gray-900 flex-shrink-0">{comment.user}</span>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <input type="text" placeholder="댓글 입력..." value={post.newCommentText} onChange={(e) => handleNewCommentChange(post.id, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                  <button onClick={() => handleCommentSubmit(post.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50" disabled={post.newCommentText.trim() === ''}>등록</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </main>

      {loading && (
        <div className="text-center py-6"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div></div>
      )}
    </div>
  );
};

export default EcoFeedPage;