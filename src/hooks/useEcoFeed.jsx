import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // AuthContext 경로 주의

const PROFILE_BASE_URL = "http://localhost:8081";
// 2) 프로필 이미지 URL 정리 함수
const resolveProfileImageUrl = (raw) => {
  // 값이 없으면 default.jpg
  if (!raw) {
    return `${PROFILE_BASE_URL}/uploads/default_profile.jpg`;
  }

  // 이미 http(s)로 시작하면 그대로 사용
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }

  // /로 시작하면 -> 서버 베이스 + 그대로
  if (raw.startsWith('/')) {
    return `${PROFILE_BASE_URL}${raw}`;
  }

  // 그 밖에(파일명만 있는 경우 등) -> /uploads/ 붙여서 사용
  return `${PROFILE_BASE_URL}/uploads/${raw}`;
};

export const useEcoFeed = () => {
  const { currentUser } = useAuth();               // 현재 로그인 된 유저의 정보를 가져올 수 있음
  const [filter, setFilter] = useState('all');     // 'all', 'popular', 'recruit' // 필터
  const [loading, setLoading] = useState(false);   // 서버에서 데이터를 불러오는 중인지
  const [feedData, setFeedData] = useState([]);    // 실제 피드 게시글을 저장할 배열
  const [fetchOffset, setFetchOffset] = useState(null);      // 마지막 글 id // 마지막으로 불러온 글의 id를 저장한다. 다음 페이지를 요청할 때 기준점으로 사용.
  const [hasMore, setHasMore] = useState(true);     // 더 불러올 글이 있는지 // 마지막으로 불러온 글의 id를 저장한다. 다음 페이지를 요청할 때 기준점으로 사용.
  
  const fetchFeeds = useCallback (
  async (isFirst = false) => {

    if(loading) return;
    if(!hasMore && !isFirst) return;
    
    try {
      setLoading(true); // 요청 시작 -> 로딩 중 표시
      
      const params = new URLSearchParams();
      params.append('limit', '3');

      if (!isFirst && fetchOffset != null) {
        params.append('fetchOffset', fetchOffset.toString());
      }

      const res = await fetch(`http://localhost:8081/feeds?${params.toString()}`, {
        method: 'GET',
      });

      if(!res.ok) {
        console.error('피드 불러오기 실패:', res.status);
        return;
      }

      const data = await res.json();
      if(!data || data.length === 0) {
        setHasMore(false);
        return;
      } // 배열이 비어 있으면 hasMore == false 로 종료
      
     const processed = data.map(post => ({
  id: post.boardNo,
  boardNo: post.boardNo,
  title: post.boardTitle,
  content: post.boardContent,

  boardAuthor: post.boardAuthor,

  categoryCode: post.boardCategory,
  categoryText: post.categoryName || '',

  // 🔙 단일 이미지만 사용
  imageUrl: post.attachmentPath || null,

  author: post.memberId,
  regDate: post.regDate,
  region: post.regionName,
  regionNo: post.regionNo,

  profileImage: resolveProfileImageUrl(post.memberImage),

  likes: post.likeCount ?? 0,
  comments: post.commentCount ?? 0,

  isBookmarked: post.bookmarked ?? false,

  isLiked: false,
  isCommentOpen: false,
  tags: post.tags || [],
  commentsList: post.commentsList || [],
  newCommentText: '',
  editingCommentId: null,
})); // 서버에서 온 각 게시글에 isLiked, isCommentOpen, commentsList, newCommentText 같은
              // 프론트 전용 필드를 붙여준다.
    
      setFeedData(prev => {
        if (isFirst) return processed;

        // 이미 화면에 있는 글 id들 집합
        const existingIds = new Set(prev.map(p => p.id));
        // 아직 없는 글만 필터링
        const onlyNew = processed.filter(p => !existingIds.has(p.id));

        return [...prev, ...onlyNew];
      }); 
      // 처음 호출이면 기존 것을 무시하고 새 데이터로 덮어쓰기
      // 추가 호출이면 기존 배열 뒤에 새 배열 붙이기
      // 이번에 받은 데이터 중 가장 작은 boardNo를 다음 fetchOffset으로 사용
      const boardNos = data.map(item => item.boardNo).filter(n => typeof n === 'number');
      if (boardNos.length > 0) {
        const minBoardNo = Math.min(...boardNos);
        setFetchOffset(minBoardNo);
      }
        // 이번에 가져온 글들 중 마지막 글의 id를 fetchOffset 에 저장
        // 다음 요청 때 ?fetchOffset=마지막id 로 계속 이어감
      
    } catch (error) {
      console.error('피드 불러오기 에러:', error);
    } finally {
      setLoading(false);
    }
  },
  [loading, hasMore, fetchOffset]
 ); // try/catch/finally 구조로 네트워크 에러 처리
     // 어떤 경우든 마지막에 loading=false 로 돌려놓는다.
     // 여기까지가 fetchFeeds 함수 한 세트다.
     
     useEffect(() => {
      fetchFeeds(true);
     }, []);
     // 컴포넌트가 처음 렌더링 될 때 fetchFeeds(true) 호출 -> 첫 3개 글 로드

     useEffect(() => {
      const handleScroll = () => {
        const { scrollTop, scrollHeight } = document.documentElement;
        const { innerHeight } = window;
        if(loading || !hasMore) return;
        if(innerHeight + scrollTop + 50 >= scrollHeight) {
          fetchFeeds(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
     }, [fetchFeeds, loading, hasMore]);
     // 스크롤 할 때마다 거의 바닥인가? 체크하고 맞으면 fetchFeeds(false)로 다음 페이지 로드
     // 언마운트/변경 시 이벤트 제거
 

  // 좋아요 토글 (백엔드 연동 + 로그인 필수)
const handleLikeToggle = async (postId) => {
  // 1) 로그인 체크 (accessToken 없으면 막기)
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    alert('로그인 후 이용 가능한 기능입니다.');
    return;
  }

  try {
    // 2) 백엔드로 좋아요 토글 요청
    const res = await fetch(`http://localhost:8081/feeds/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error('좋아요 요청 실패:', res.status);
      return;
    }

    const data = await res.json();
    // boolean 필드 이름이 isLiked 또는 liked 둘 다 올 수 있으니 방어적으로 처리
    const likedFlag =
      typeof data.isLiked === 'boolean'
        ? data.isLiked
        : data.liked;

    const likeCount = data.likeCount ?? 0;

    // 3) 응답 값으로 프론트 상태 갱신
    setFeedData((prevFeed) =>
      prevFeed.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: likedFlag,
              likes: likeCount,
            }
          : post
      )
    );
  } catch (error) {
    console.error('좋아요 처리 중 에러:', error);
  }
};

const handleBookmarkToggle = async (postId) => {
  // 1) 로그인 체크
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    alert('로그인 후 이용 가능한 기능입니다.');
    return;
  }

  try {
    // 2) 백엔드로 북마크 토글 요청
    const res = await fetch(`http://localhost:8081/feeds/${postId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      // BookmarkDTO는 서버에서 memberNo/boardNo 채워주니까 비워둬도 됨
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      console.error('북마크 요청 실패:', res.status);
      return;
    }

    // 3) 서버에서 토글 성공했으니 프론트도 토글
    setFeedData((prevFeed) =>
      prevFeed.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  } catch (error) {
    console.error('북마크 처리 중 에러:', error);
  }
};


// 댓글 조회
const fetchComments = useCallback(async (boardNo) => {
  try {
    const res = await fetch(`http://localhost:8081/comments?boardNo=${boardNo}`, {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('댓글 불러오기 실패:', res.status);
      return;
    }

    const data = await res.json(); // List<CommentDTO>
    console.log('[댓글 응답 data]', data);
    const processed = data.map((c) => ({
      id: c.commentNo,
      user: c.memberId,                         // 작성자 아이디
      text: c.commentContent,                   // 댓글 내용
      profileImage: resolveProfileImageUrl(c.memberImage), // 프로필 이미지
      date: c.regDate
    ? new Date(c.regDate).toLocaleDateString('ko-KR')
    : '',
    }));

    // 해당 게시글의 commentsList만 교체
    setFeedData((prev) =>
      prev.map((post) =>
        post.id === boardNo
          ? { ...post, commentsList: processed, comments: processed.length }
          : post
      )
    );
  } catch (err) {
    console.error('댓글 불러오기 에러:', err);
  }
}, []);

// 댓글창 토글 + 열 때 댓글 조회
const handleCommentToggle = (postId) => {
  console.log('[handleCommentToggle] 클릭, postId = ', postId);
  // 1) 우선 현재 상태 기준으로 isCommentOpen 토글
  setFeedData((prevFeed) =>
    prevFeed.map((post) =>
      post.id === postId
        ? { ...post, isCommentOpen: !post.isCommentOpen }
        : post
    )
  );

  // 2) 이전 상태에서 "닫혀 있던 경우"에만 조회 호출
  const target = feedData.find((p) => p.id === postId);
  if (target && !target.isCommentOpen) {
    // 지금 클릭으로 "열리는" 시점 → 서버에서 댓글 가져오기
    fetchComments(postId);
  }
};
/*
  // 댓글창 토글
  const handleCommentToggle = (postId) => {
    setFeedData(prevFeed =>
      prevFeed.map(post =>
        post.id === postId ? { ...post, isCommentOpen: !post.isCommentOpen } : post
      )
    );
  };
*/
  // 댓글 입력 핸들러
  const handleNewCommentChange = (postId, text) => {
    setFeedData(prevFeed =>
      prevFeed.map(post =>
        post.id === postId ? { ...post, newCommentText: text } : post
      )
    );
  };

  // 댓글 등록 핸들러 (JWT 사용)
 const handleCommentSubmit = async (postId) => {
  const post = feedData.find((p) => p.id === postId);
  if (!post) return;

  const content = post.newCommentText.trim();
  if (content === '') return;

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('로그인된 토큰이 없습니다. 로그인 후 다시 시도해주세요.');
    return;
  }

  const isEdit = !!post.editingCommentId;
  const url = isEdit
    ? `http://localhost:8081/comments/${post.editingCommentId}`
    : 'http://localhost:8081/comments';

  const method = isEdit ? 'PUT' : 'POST';

  const body = isEdit
    ? JSON.stringify({
        commentContent: content,         // 🔥 수정할 내용만 보내기
      })
    : JSON.stringify({
        refBno: postId,                  // 게시글 번호
        commentContent: content,         // 댓글 내용
      });

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (!res.ok) {
      console.error(isEdit ? '댓글 수정 실패:' : '댓글 등록 실패:', res.status);
      return;
    }

    // 입력창 비우고 수정 모드 해제
    setFeedData((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, newCommentText: '', editingCommentId: null }
          : p
      )
    );

    // 최신 댓글 목록 다시 조회
    await fetchComments(postId);
  } catch (err) {
    console.error(isEdit ? '댓글 수정 에러:' : '댓글 등록 에러:', err);
  }
};


  // 댓글 삭제 + 부드러운 페이드아웃
const handleCommentDelete = async (postId, commentId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("로그인 토큰이 없습니다.");
      return;
    }

    const res = await fetch(`http://localhost:8081/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("댓글 삭제 실패:", res.status);
      return;
    }

    // 1단계: 삭제 애니메이션 시작 (deleting 플래그 켜기)
    setFeedData((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsList: post.commentsList.map((c) =>
                c.id === commentId ? { ...c, deleting: true } : c
              ),
            }
          : post
      )
    );

    // 2단계: 애니메이션 끝난 뒤 실제로 배열에서 제거
    setTimeout(() => {
      setFeedData((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentsList: post.commentsList.filter(
                  (c) => c.id !== commentId
                ),
                comments: Math.max(0, post.comments - 1),
              }
            : post
        )
      );
    }, 220); // index.css 의 animation 시간(0.25s)이랑 비슷하게
  } catch (e) {
    console.error("댓글 삭제 에러:", e);
  }
};

// 🔥 게시글 삭제 (백엔드 연동)
const handlePostDelete = async (postId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인 후 이용 가능한 기능입니다.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8081/feeds/${postId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("게시글 삭제 실패:", res.status);
      return;
    }

    // 🔥 프론트 목록에서 해당 게시글 제거
    setFeedData((prev) => prev.filter((post) => post.id === undefined ? true : post.id !== postId));
  } catch (e) {
    console.error("게시글 삭제 에러:", e);
  }
};

// 게시글 신고하기
const handleReportSubmit = async (postId, reason, content) => {
  if (!reason) {
    alert("신고 사유를 선택해주세요.");
    return;
  }

  if (!content || content.trim() === "") {
    alert("신고 내용을 입력해주세요.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8081/boards/${postId}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        refBno: postId,
        refRcno: reason,
        reportContent: content.trim(),
      }),
    });

    if (!res.ok) {
      alert("신고 처리 실패");
      return;
    }

    alert("신고가 접수되었습니다.");
  } catch (err) {
    console.error("신고 에러:", err);
    alert("신고 처리 중 오류 발생");
  }
};

// 댓글 신고하기
const handleCommentReportSubmit = async (commentId, reason, content) => {
  if (!reason) {
    alert("신고 사유를 선택해주세요.");
    return;
  }

  if (!content || content.trim() === "") {
    alert("신고 내용을 입력해주세요.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8081/comments/${commentId}/reports`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // refCno는 서버에서 pathVariable로 세팅하니까 여기선 안 보냄
          refRcno: reason,                 // 신고 사유 코드 (1~5)
          reportContent: content.trim(),   // 신고 내용
        }),
      }
    );

    if (!res.ok) {
      alert("댓글 신고 처리 실패");
      return;
    }

    alert("댓글 신고가 접수되었습니다.");
  } catch (err) {
    console.error("댓글 신고 에러:", err);
    alert("댓글 신고 처리 중 오류가 발생했습니다.");
  }
};


// 댓글 수정하기~!
const handleCommentEditInit = (postId, commentId) => {
  setFeedData(prev =>
    prev.map(post => {
      if (post.id !== postId) return post;

      const target = post.commentsList.find(c => c.id === commentId);
      return {
        ...post,
        editingCommentId: commentId,
        newCommentText: target ? target.text : '',
      };
    })
  );
};

// 2) 수정 취소
const handleCommentEditCancel = (postId) => {
  setFeedData(prev =>
    prev.map(post =>
      post.id === postId
        ? { ...post, editingCommentId: null, newCommentText: '' }
        : post
    )
  );
};




  /*
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
  }, [loading, feedData]);*/

  // 필터링된 데이터 반환
  const filteredFeed = feedData.filter(post => {
    if (filter === 'popular') return Number(post.likes) >= 100;
    if (filter === 'recruit') return post.categoryCode === 'C2';
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
    handleCommentSubmit,
    handleCommentDelete,
    currentUserId: currentUser?.memberId ?? localStorage.getItem("memberId"),
    currentUserNo: currentUser?.memberNo ?? localStorage.getItem("memberNo"),
   
    handleBookmarkToggle,
    
    handlePostDelete,
    handleReportSubmit,

    handleCommentEditInit,
    handleCommentEditCancel,

    handleCommentReportSubmit,
    }
  };
}; 