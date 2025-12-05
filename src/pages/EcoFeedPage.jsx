import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Bookmark, Users, PlusSquare, Hash, Activity, ThumbsUp, Trash, Pencil, AlertTriangle } from 'lucide-react';
import { useEcoFeed } from '../hooks/useEcoFeed'; // Hook Import



const EcoFeedPage = () => {
  const navigate = useNavigate();
  const { 
    filteredFeed, filter, setFilter, loading, handlers 
  } = useEcoFeed();

  const {
  handleLikeToggle,
  handleCommentToggle,
  handleNewCommentChange,
  handleCommentSubmit,
  handleCommentDelete,
  currentUserId,
  currentUserNo,
  handleBookmarkToggle,
  handlePostDelete,
  handleReportSubmit,
  handleCommentEditInit,
  handleCommentEditCancel,
  handleCommentReportSubmit,
} = handlers;

// 🔥 실시간 통계 상태
  const [stats, setStats] = useState({
    todayParticipants: 0, // 오늘의 참여
    todayPost: 0,         // 오늘의 새 글
  });

    useEffect(() => {
    const fetchStats = async () => {
      try {
        // 필요한 카테고리 코드 (예: 참여모집이 C2라면 C2 사용)
        const category = 'C2';

        const [resParticipants, resPost] = await Promise.all([
          fetch(`http://localhost:8081/stats/today?category=${category}`),
          fetch(`http://localhost:8081/stats/todayPost?category=${category}`),
        ]);

        if (!resParticipants.ok) {
          console.error('오늘의 참여 조회 실패:', resParticipants.status);
        }
        if (!resPost.ok) {
          console.error('오늘의 새 글 조회 실패:', resPost.status);
        }

        const participantsData = await resParticipants.json().catch(() => ({}));
        const postData = await resPost.json().catch(() => ({}));

        setStats({
          todayParticipants: participantsData.todayParticipants ?? 0,
          todayPost: postData.todayPost ?? 0,
        });
      } catch (e) {
        console.error('실시간 통계 조회 중 에러:', e);
      }
    };

    fetchStats();
  }, []);


// 댓글 삭제
const [deleteModal, setDeleteModal] = React.useState({
  open: false,
  postId: null,
  commentId: null
});

// 🔥 게시글 삭제 모달
const [postDeleteModal, setPostDeleteModal] = React.useState({
  open: false,
  postId: null,
});

// 🔥 신고 모달 상태
const [reportModal, setReportModal] = useState({
  open: false,
  postId: null,
});

// 신고 카테고리, 내용
const [reportReason, setReportReason] = useState(null);   // 1~5
const [reportContent, setReportContent] = useState("");

// 신고 사유 목록
const REPORT_REASONS = [
  { id: 1, label: '부적절한 내용' },
  { id: 2, label: '욕설/비방 및 혐오 표현' },
  { id: 3, label: '광고/홍보 및 도배' },
  { id: 4, label: '개인정보 노출' },
  { id: 5, label: '기타' },
];

// 🔥 댓글 신고 모달 상태
const [commentReportModal, setCommentReportModal] = useState({
  open: false,
  commentId: null,
});

const [commentReportReason, setCommentReportReason] = useState(null); // 1~5
const [commentReportContent, setCommentReportContent] = useState("");


  // UI 헬퍼 함수들
  const getCategoryStyle = (code) => {
    const styles = {
      C1: 'bg-blue-100 text-blue-800',
      C2: 'bg-emerald-100 text-emerald-800',
      C3: 'bg-purple-100 text-purple-800',
      C4: 'bg-gray-100 text-gray-800',
  };
  return styles[code] || 'bg-gray-100 text-gray-800';
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
                <div className="flex justify-between items-center"><span className="text-sm text-gray-700">오늘의 새글</span><span className="text-sm font-bold text-emerald-600">{stats.todayPost} 건</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-700">오늘의 참여</span><span className="text-sm font-bold text-emerald-600">{stats.todayParticipants} 명</span></div>
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
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryStyle(post.categoryCode)}`}>
                  {post.categoryText}
                </span>
              </div>

              {/* 🔥 프로필 + 작성자 / 지역 / 날짜 */}
              <div className="flex items-center gap-3 mb-3">
                {/* 동그란 프로필 이미지 */}
                <img
                  src={post.profileImage}
                  alt={post.author}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />

                {/* 텍스트 영역 */}
                <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {post.author}
                </span>
                <span className="text-xs text-gray-500">
                  {post.region} · {post.regDate && new Date(post.regDate).toLocaleDateString()}
                </span>
              </div>

              

              </div>


              {/* 제목 + 삭제 X 버튼 */}
<div className="flex items-center justify-between mb-2">
  <h3 className="text-xl font-bold text-gray-900">
    {post.title}
  </h3>

  {/* 🔥 본인 글일 때만 X 버튼 보이게 (currentUserId == post.author) */}
  {String(currentUserId) === String(post.author) && (
    <button
      onClick={() => setPostDeleteModal({ open: true, postId: post.id })}
      className="ml-3 text-gray-300 hover:text-red-500 transition-colors text-xl leading-none"
      title="게시글 삭제"
    >
      ×
    </button>
  )}
</div>

<p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

            </div>

            {post.imageUrl && (
  <div className="w-full bg-black/5">
    <img
      src={post.imageUrl}
      alt={post.title}
      className="w-full max-h-[480px] object-cover"
    />
  </div>
)}

            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {(post.tags || []).map((tag, index) => (
                  <span key={index} className="text-sm text-emerald-600 font-medium cursor-pointer hover:underline">{tag}</span>
                ))}
              </div>

              {post.categoryCode === 'C2' && (
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
                 <button
                  onClick={() => handleBookmarkToggle(post.id)}
                  className={`flex items-center space-x-1.5 transition-colors ${
                    post.isBookmarked
                      ? 'text-amber-500'                  // 북마크 된 상태
                      : 'text-gray-500 hover:text-emerald-600' // 기본 상태
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">북마크</span>
                </button>
                </div>
                <div className="flex space-x-5">
                  <button onClick={() => handleLikeToggle(post.id)} className={`flex items-center space-x-1.5 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                    <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} /> <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button onClick={() => handleCommentToggle(post.id)} className={`flex items-center space-x-1.5 transition-colors ${post.isCommentOpen ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}>
                    <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                   {/* 🔥 본인 게시글일 때만 연필 아이콘 표시 */}
                    {String(currentUserId) === String(post.author) && (
                      <button
                      onClick={() =>
                        navigate(`/feed-edit/${post.id}`, {
                          state: { post },   // 🔥 이걸 추가
                        })
                      }
                      className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    )}

                    {/* 🔥 신고 (사이렌) – 로그인 O && 본인 글이 아닐 때만 */}
                    {currentUserId && String(currentUserNo) !== String(post.boardAuthor) && (
                    <button
                      onClick={() =>
                        setReportModal({
                          open: true,
                          postId: post.id,
                        })
                      }
                      className="flex items-center space-x-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="신고하기"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                  )}
                  
                </div>
              </div>
            </div>

            {post.isCommentOpen && (
              <div className="border-t border-gray-200 px-5 py-4 bg-gray-50/50">
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                {(post.commentsList || []).map(comment => (
                <div
                      key={comment.id}
                      className={`flex justify-between items-start space-x-2 ${
                        comment.deleting ? "comment-fade-out" : ""
                      }`}
                    >

                  {/* 왼쪽: 프로필 + 내용 */}
                  <div className="flex space-x-2">
                    <img
                      src={comment.profileImage}
                      alt={comment.user}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{comment.user}</span>

                        {comment.date && (
                          <span className="text-[11px] text-gray-400">
                            {new Date(comment.date).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>

                  {/* 오른쪽: 본인 댓글만 삭제 가능 */}
                  {String(currentUserId) === String(comment.user) && (
                <div className="flex items-center space-x-1">

                  {/* 🔥 사이렌 (신고) */}
                <button
                  onClick={() =>
                    setCommentReportModal({
                      open: true,
                      commentId: comment.id,
                    })
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                  title="댓글 신고"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
                  
                  {/* 🔥 연필 (수정) */}
                  <button
                    onClick={() => handleCommentEditInit(post.id, comment.id)}
                    className="text-gray-400 hover:text-emerald-600 transition"
                    title="댓글 수정"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                {/* 휴지통 (삭제) */}
                <button
                  onClick={() =>
                    setDeleteModal({ open: true, postId: post.id, commentId: comment.id })
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                  title="댓글 삭제"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            )}

                </div>
              ))}
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
  <input
    type="text"
    placeholder={
      post.editingCommentId
        ? '댓글을 수정하세요...'
        : '댓글 입력...'
    }
    value={post.newCommentText}
    onChange={(e) => handleNewCommentChange(post.id, e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />

  {/* 🔥 수정 취소 버튼 (수정 중일 때만) */}
  {post.editingCommentId && (
    <button
      onClick={() => handleCommentEditCancel(post.id)}
      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
    >
      취소
    </button>
  )}

  <button
    onClick={() => handleCommentSubmit(post.id)}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
    disabled={post.newCommentText.trim() === ''}
  >
    {post.editingCommentId ? '수정' : '등록'}
  </button>
</div>
              </div>
            )}
          </article>
        ))}
      </main>

      {loading && (
        <div className="text-center py-6"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div></div>
      )}

      {deleteModal.open && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white shadow-xl rounded-2xl p-6 w-80 animate-fadeIn">
      
      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
        댓글을 삭제하시겠습니까?
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        삭제된 댓글은 복구할 수 없습니다.
        <br />정말로 삭제하시겠어요?
      </p>

      <div className="flex justify-between">
        <button
          onClick={() => setDeleteModal({ open: false, postId: null, commentId: null })}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition w-1/2 mr-2"
        >
          취소
        </button>

        <button
          onClick={async () => {
            await handleCommentDelete(deleteModal.postId, deleteModal.commentId);
            setDeleteModal({ open: false, postId: null, commentId: null });
          }}
          className="px-4 py-2 bg-emerald-100 rounded-lg text-white font-medium hover:bg-red-700 transition w-1/2 ml-2"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
)}

{/* 🔥 게시글 삭제 모달 */}
{postDeleteModal.open && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white shadow-xl rounded-2xl p-6 w-80 animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
        정말로 삭제하시겠습니까?
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        삭제 후에는 복원할 수 없습니다.
      </p>

      <div className="flex justify-between">
        <button
          onClick={() => setPostDeleteModal({ open: false, postId: null })}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition w-1/2 mr-2"
        >
          취소
        </button>

        <button
          onClick={async () => {
            await handlePostDelete(postDeleteModal.postId);
            setPostDeleteModal({ open: false, postId: null });
          }}
          className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition w-1/2 ml-2"
        >
          삭제하기
        </button>
      </div>
    </div>
  </div>
)}

{/* 🔥 여기 "신고 모달" 추가 */}

{reportModal.open && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white shadow-xl rounded-2xl p-6 w-[360px] max-w-[90%] animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
        게시글 신고하기
      </h2>

      {/* 신고 사유 선택 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">신고 사유</p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason.id}
              className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer text-sm
                ${
                  reportReason === reason.id
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                }`}
            >
              <span>{reason.label}</span>
              <input
                type="radio"
                name="reportReason"
                value={reason.id}
                checked={reportReason === reason.id}
                onChange={() => setReportReason(reason.id)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 신고 내용 입력 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">신고 내용</p>
        <textarea
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[80px]"
          placeholder="신고 사유에 대해 구체적으로 적어주세요."
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setReportModal({
              open: false,
              postId: null,
            })
          }
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition w-1/2 mr-2"
        >
          취소
        </button>

        <button
          onClick={async () => {
            // 🔥 신고 제출 핸들러 (useEcoFeed 안에 handleReportSubmit 만들어둔 상태여야 함)
            if (!reportReason) {
              alert('신고 사유를 선택해주세요.');
              return;
            }
            await handleReportSubmit(
              reportModal.postId,
              reportReason,
              reportContent
            );
            setReportModal({ open: false, postId: null });
            setReportReason(null);
            setReportContent('');
          }}
          className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition w-1/2 ml-2"
        >
          신고하기
        </button>
      </div>
    </div>
  </div>
)}

{/* 🔥 댓글 신고 모달 */}
{commentReportModal.open && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white shadow-xl rounded-2xl p-6 w-[360px] max-w-[90%] animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
        댓글 신고하기
      </h2>

      {/* 신고 사유 선택 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          신고 사유
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason.id}
              className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer text-sm
                ${
                  commentReportReason === reason.id
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                }`}
            >
              <span>{reason.label}</span>
              <input
                type="radio"
                name="commentReportReason"
                value={reason.id}
                checked={commentReportReason === reason.id}
                onChange={() => setCommentReportReason(reason.id)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 신고 내용 입력 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          신고 내용
        </p>
        <textarea
          value={commentReportContent}
          onChange={(e) => setCommentReportContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[80px]"
          placeholder="신고 사유에 대해 구체적으로 적어주세요."
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setCommentReportModal({ open: false, commentId: null });
            setCommentReportReason(null);
            setCommentReportContent("");
          }}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition w-1/2 mr-2"
        >
          취소
        </button>

        <button
          onClick={async () => {
            await handleCommentReportSubmit(
              commentReportModal.commentId,
              commentReportReason,
              commentReportContent
            );
            setCommentReportModal({ open: false, commentId: null });
            setCommentReportReason(null);
            setCommentReportContent("");
          }}
          className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition w-1/2 ml-2"
        >
          신고하기
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default EcoFeedPage;