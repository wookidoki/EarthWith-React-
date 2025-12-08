import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComment } from '../../hooks/useComment';

// 신고 카테고리 상수
const REPORT_CATEGORIES = [
    { no: 1, name: "부적절한 내용" },
    { no: 2, name: "욕설/비방" },
    { no: 3, name: "광고/도배" },
    { no: 4, name: "기타" }
];

const CommentSection = ({ boardNo, commentList, onRefresh }) => {
    const { auth } = useAuth(); // 현재 로그인한 사용자 정보
    const { addComment, updateComment, deleteComment, reportComment } = useComment();

    const [newContent, setNewContent] = useState(""); // 새 댓글 입력창
    const [editingId, setEditingId] = useState(null); // 수정 중인 댓글 ID
    const [editContent, setEditContent] = useState(""); // 수정 내용
    
    // 신고 모달 상태
    const [reportModal, setReportModal] = useState({ show: false, commentNo: null });
    const [reportInput, setReportInput] = useState({ category: 1, content: "" });

    // --- 핸들러 ---

    // 1. 댓글 등록
    const handleAdd = async () => {
        if (!newContent.trim()) return alert("내용을 입력해주세요.");
        const success = await addComment(boardNo, newContent);
        if (success) {
            setNewContent("");
            onRefresh(); // 부모 컴포넌트(게시글 상세) 새로고침 요청
        }
    };

    // 2. 댓글 수정 모드 진입
    const startEdit = (comment) => {
        setEditingId(comment.commentNo);
        setEditContent(comment.commentContent);
    };

    // 3. 댓글 수정 완료
    const handleUpdate = async (commentNo) => {
        const success = await updateComment(commentNo, editContent);
        if (success) {
            setEditingId(null);
            onRefresh();
        }
    };

    // 4. 댓글 삭제
    const handleDelete = async (commentNo) => {
        const success = await deleteComment(commentNo);
        if (success) onRefresh();
    };

    // 5. 신고 제출
    const handleReportSubmit = async () => {
        const data = {
            refRcno: reportInput.category,
            reportContent: reportInput.content
        };
        const success = await reportComment(reportModal.commentNo, data);
        if (success) {
            setReportModal({ show: false, commentNo: null });
            setReportInput({ category: 1, content: "" });
        }
    };

    // --- UI 렌더링 ---
    return (
        <div className="comment-section" style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #ddd' }}>
            <h3>댓글 ({commentList ? commentList.length : 0})</h3>

            {/* 댓글 작성 폼 */}
            <div className="comment-input" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <textarea
                    style={{ flex: 1, padding: '10px', resize: 'none', height: '60px' }}
                    placeholder={auth.isAuthenticated ? "댓글을 작성해주세요." : "로그인 후 작성 가능합니다."}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    disabled={!auth.isAuthenticated}
                />
                <button 
                    onClick={handleAdd} 
                    disabled={!auth.isAuthenticated}
                    style={{ padding: '0 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
                >
                    등록
                </button>
            </div>

            {/* 댓글 리스트 */}
            <div className="comment-list">
                {commentList && commentList.map((comment) => {
                    // 권한 체크: 본인 이거나 관리자
                    const isOwner = auth.isAuthenticated && (Number(auth.memberNo) === Number(comment.refMno));
                    const isAdmin = auth.role === 'ROLE_ADMIN';
                    const canEdit = isOwner || isAdmin;
                    const canDelete = isOwner || isAdmin;

                    return (
                        <div key={comment.commentNo} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <strong>{comment.memberName || "익명"}</strong>
                                <span style={{ fontSize: '12px', color: '#888' }}>{comment.regDate}</span>
                            </div>

                            {/* 수정 모드 vs 일반 모드 */}
                            {editingId === comment.commentNo ? (
                                <div>
                                    <textarea 
                                        value={editContent} 
                                        onChange={(e) => setEditContent(e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                    <div style={{ marginTop: '5px' }}>
                                        <button onClick={() => handleUpdate(comment.commentNo)}>저장</button>
                                        <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: '5px 0' }}>{comment.commentContent}</p>
                            )}

                            {/* 버튼 그룹 */}
                            <div style={{ fontSize: '12px', marginTop: '10px' }}>
                                {canEdit && !editingId && (
                                    <>
                                        {/* 관리자는 수정 기능 제외하고 삭제만 필요한 경우 이 버튼 숨김 처리 가능 */}
                                        <button onClick={() => startEdit(comment)} style={{ marginRight: '5px', background:'none', border:'none', color:'blue', cursor:'pointer' }}>수정</button>
                                        <button onClick={() => handleDelete(comment.commentNo)} style={{ marginRight: '5px', background:'none', border:'none', color:'red', cursor:'pointer' }}>삭제</button>
                                    </>
                                )}
                                {auth.isAuthenticated && (
                                    <button 
                                        onClick={() => setReportModal({ show: true, commentNo: comment.commentNo })}
                                        style={{ background:'none', border:'none', color:'#999', cursor:'pointer' }}
                                    >
                                        🚨 신고
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 신고 모달 (간단 구현) */}
            {reportModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '300px' }}>
                        <h4>댓글 신고하기</h4>
                        <select 
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            value={reportInput.category}
                            onChange={(e) => setReportInput({...reportInput, category: Number(e.target.value)})}
                        >
                            {REPORT_CATEGORIES.map(c => <option key={c.no} value={c.no}>{c.name}</option>)}
                        </select>
                        <textarea 
                            placeholder="상세 사유를 입력하세요"
                            style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                            value={reportInput.content}
                            onChange={(e) => setReportInput({...reportInput, content: e.target.value})}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                            <button onClick={handleReportSubmit}>제출</button>
                            <button onClick={() => setReportModal({ show: false, commentNo: null })}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentSection;