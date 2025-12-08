import React, { useState, useEffect } from "react";
import { useNotice } from "../../hooks/useNotice";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronLeft, ChevronRight, Megaphone, Plus, 
  XCircle, List, Edit, Trash2, FileText, CheckCircle
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

// ===============================================================
// [모달] 공지사항 등록 / 수정 폼
// ===============================================================
const NoticeFormModal = ({ isOpen, onClose, isEditMode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    boardTitle: "",
    boardContent: "",
    boardCategory: "A1"
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        boardTitle: initialData.boardTitle || "",
        boardContent: initialData.boardContent || "",
        boardCategory: initialData.boardCategory || "A1"
      });
    } else {
      setFormData({ boardTitle: "", boardContent: "", boardCategory: "A1" });
      setFiles([]);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            {isEditMode ? <Edit className="w-5 h-5 mr-2 text-blue-600" /> : <Plus className="w-5 h-5 mr-2 text-emerald-600" />}
            {isEditMode ? "공지사항 수정" : "공지사항 등록"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              name="boardCategory"
              value={formData.boardCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="A1">에너지 (관리자)</option>
              <option value="A2">자동차 (관리자)</option>
              <option value="A3">일상생활 (관리자)</option>
              <option value="A4">녹색소비 (관리자)</option>
              <option value="AN">기타 (관리자)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              name="boardTitle"
              value={formData.boardTitle}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              name="boardContent"
              value={formData.boardContent}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="공지 내용을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">첨부파일</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              {isEditMode ? "수정완료" : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===============================================================
// [모달] 상세 조회
// ===============================================================
const NoticeDetailModal = ({ notice, onClose, onEdit, onDelete, isAdmin }) => {
  if (!notice) return null;

  // 데이터 포장 뜯기 (중첩 구조 대응)
  const data = notice.board || notice; 
  const files = notice.attachments || notice.attachment || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-emerald-600" /> 공지 상세
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mb-2">
              {data.categoryName || data.category || "카테고리"}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{data.boardTitle}</h2>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 border-b pb-4">
            <span>작성자: {data.memberName || data.boardWriter || "관리자"}</span>
            <span>{data.regDate || data.createDate}</span>
          </div>

          <div className="min-h-[100px] text-gray-700 whitespace-pre-wrap leading-relaxed">
            {data.boardContent}
          </div>

          {files.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" /> 첨부파일
              </h4>
              <ul className="text-sm space-y-1">
                {files.map((file, index) => (
                  <li key={file.fileNo || index}>
                    <a 
                      href={`http://localhost:8081${file.attachmentPath}`} 
                      download={file.originalFileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      - {file.originalFileName || file.originName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onEdit} className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
            <Edit className="w-4 h-4 mr-1" /> 수정
          </button>
          <button onClick={onDelete} className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
            <Trash2 className="w-4 h-4 mr-1" /> 삭제
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// ===============================================================
// 메인 페이지
// ===============================================================
const NoticeManagementPage = () => {
  const { auth } = useAuth();
  
  // 🔥 [중요] loading 변수 Destructuring (에러 해결)
  const { notices, totalCount, loading, fetchNotices, fetchNoticeDetail, createNotice, updateNotice, deleteNotice } = useNotice();
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTargetData, setEditTargetData] = useState(null);

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage, fetchNotices]);

  // 상세 조회
  const handleRowClick = async (boardNo) => {
    try {
      const detail = await fetchNoticeDetail(boardNo);
      setSelectedNotice(detail);
    } catch (e) {
      alert("상세 정보를 불러오지 못했습니다.");
    }
  };

  // 글쓰기 버튼
  const handleWriteClick = () => {
    setIsEditMode(false);
    setEditTargetData(null);
    setIsFormOpen(true);
  };

  // 폼 제출 (등록/수정)
  const handleFormSubmit = async (data, files) => {
    try {
      const storedMemberNo = localStorage.getItem("memberNo");
      const realMemberNo = storedMemberNo ? parseInt(storedMemberNo) : 1;
      
      const submitData = {
        ...data,
        refMno: realMemberNo,
        boardCategory: data.boardCategory || "A1"
      };

      const fileArray = files ? Array.from(files) : [];

      if (isEditMode && editTargetData) {
        await updateNotice(editTargetData.boardNo, submitData, fileArray);
        alert("공지사항이 수정되었습니다.");
      } else {
        await createNotice(submitData, fileArray);
        alert("공지사항이 등록되었습니다.");
      }
      
      setIsFormOpen(false);
      setSelectedNotice(null);
      fetchNotices(currentPage); 
    } catch (e) {
      console.error(e);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!selectedNotice) return;
    if (window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      try {
        const data = selectedNotice.board || selectedNotice; // ID 안전하게 추출
        await deleteNotice(data.boardNo);
        alert("삭제되었습니다.");
        setSelectedNotice(null);
        fetchNotices(currentPage);
      } catch (e) {
        alert("삭제 실패");
      }
    }
  };

  // 수정 모드 전환
  const handleEditMode = () => {
    const data = selectedNotice.board || selectedNotice;
    setEditTargetData({
        boardNo: data.boardNo,
        boardTitle: data.boardTitle,
        boardContent: data.boardContent,
        boardCategory: data.boardCategory
    });
    setIsEditMode(true);
    setSelectedNotice(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-12 py-10">
        
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-4 flex items-center">
            <Megaphone className="w-7 h-7 mr-2 text-emerald-500" /> 공지사항 관리
          </h1>
          <button 
            onClick={handleWriteClick}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition"
          >
            <Plus className="w-5 h-5 mr-1" /> 공지 등록
          </button>
        </header>

        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-emerald-50">
              <tr>
                {["번호", "카테고리", "제목", "작성자", "작성일", "조회수", "상태"].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(notices) && notices.length > 0 ? (
                notices.map((item) => (
                  <tr 
                    key={item.boardNo || Math.random()} 
                    onClick={() => handleRowClick(item.boardNo)}
                    className="hover:bg-yellow-50 transition duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">{item.boardNo}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                        {item.categoryName || item.category || "카테고리"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.boardTitle || "제목 없음"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {item.memberName || item.boardWriter || "작성자"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {item.regDate || item.createDate || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {item.viewCount ?? item.count ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Y' ? (
                        <span className="flex items-center text-green-600 text-sm font-bold">
                          <CheckCircle className="w-4 h-4 mr-1" /> 게시중
                        </span>
                      ) : (
                        <span className="text-red-500 text-sm font-bold">삭제됨</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    {loading ? "데이터를 불러오는 중입니다..." : "등록된 공지사항이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center py-4 bg-white rounded-b-xl border-t">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 mx-1 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 text-sm font-medium text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 mx-1 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <NoticeDetailModal 
        notice={selectedNotice} 
        onClose={() => setSelectedNotice(null)} 
        onEdit={handleEditMode}
        onDelete={handleDelete}
      />
      <NoticeFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        isEditMode={isEditMode}
        initialData={editTargetData}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default NoticeManagementPage;