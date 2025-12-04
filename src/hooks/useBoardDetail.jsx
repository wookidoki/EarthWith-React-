import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081';

export const useBoardDetail = (id) => {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. 게시글 상세 조회
    useEffect(() => {
        if (!id) return;

        const fetchBoardDetail = async () => {
            setLoading(true);
            try {
                // 로그인 여부와 관계없이 조회는 가능 (필요시 토큰 추가 가능)
                const response = await axios.get(`${API_BASE_URL}/boards/${id}`);
                const data = response.data;

                // 서버 데이터를 프론트엔드용 객체로 매핑
                const mappedPost = {
                    boardNo: data.boardNo,
                    title: data.boardTitle,
                    category: data.boardCategory,
                    content: data.boardContent,
                    author: data.memberName,       // 화면에 보여줄 작성자 이름
                    boardWriter: data.boardWriter, // [핵심] 권한 체크용 아이디 (DB의 REF_MNO -> MEMBER_ID)
                    views: data.viewCount,
                    date: data.regDate,
                    img: data.attachmentPath || null // 이미지가 없으면 null
                };

                setPost(mappedPost);
                setComments(data.commentList || []); // 댓글 리스트 설정

            } catch (err) {
                console.error("Error fetching detail:", err);
                setError("게시글을 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();
    }, [id]);

    // 2. 게시글 삭제 (토큰 포함)
    const deletePost = async () => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.")) return;

        try {
            const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
            
            // DELETE 요청 시 헤더에 토큰 실어서 보냄
            await axios.delete(`${API_BASE_URL}/boards/${id}`, {
                headers: { 
                    "Authorization": `Bearer ${token}` 
                }
            });
            
            alert("게시글이 삭제되었습니다.");
            navigate('/board'); // 목록으로 이동
        } catch (err) {
            console.error("Delete failed:", err);
            // 백엔드에서 본인이 아닐 경우 에러를 반환하므로 여기서 잡힘
            alert("삭제에 실패했습니다. 본인이 작성한 글인지 확인해주세요.");
        }
    };

    // 3. 댓글 작성 (임시 - API 연결 전)
    const handleAddComment = async (memberName) => {
        if (!newComment.trim()) return;
        
        // TODO: 백엔드 API 연동 시 axios.post 사용
        const tempComment = {
            commentNo: Date.now(),
            memberName: memberName || "익명",
            commentContent: newComment,
            regDate: new Date().toISOString().split('T')[0]
        };
        setComments([...comments, tempComment]);
        setNewComment("");
    };

    // 4. 댓글 삭제 (임시 - API 연결 전)
    const handleDeleteComment = (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        
        // TODO: 백엔드 API 연동 시 axios.delete 사용
        setComments(comments.filter(c => c.commentNo !== commentId));
    };

    return {
        post,
        comments,
        newComment, setNewComment,
        loading, error,
        actions: {
            deletePost,
            handleAddComment,
            handleDeleteComment
        }
    };
};