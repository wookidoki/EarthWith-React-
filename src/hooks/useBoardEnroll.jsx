import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// 백엔드 기본 주소 설정 (포트 번호 8081 확인 필요)
const API_BASE_URL = 'http://localhost:8081';

const apiRequest = async (url, data, method = 'POST') => {
    const token = localStorage.getItem('accessToken');
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // API_BASE_URL을 앞에 붙여서 백엔드로 요청 전송
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: method,
        headers: headers,
        body: data instanceof FormData ? data : JSON.stringify(data)
    });

    if (response.status === 403) {
        let errorMsg = "권한이 부족합니다(403).";
        try {
            const errorText = await response.text();
            if (errorText) {
                // 서버에서 보낸 에러 메시지가 있다면 포함
                errorMsg += ` 서버 메시지: ${errorText}`;
            } else {
                errorMsg += " (접근 권한이 없거나 허용되지 않은 요청입니다)";
            }
        } catch (e) {
            errorMsg += " (서버 응답을 읽을 수 없습니다)";
        }
        throw new Error(errorMsg);
    }
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`서버 오류 (${response.status}): ${errorText || '요청 실패'}`);
    }
    
    if (response.status === 204) return {};
    return response.json();
};

export const useBoardEnroll = () => { 
    const navigate = useNavigate();
    const { isAdmin, isLoggedIn } = useAuth(); 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [file, setFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    const adminCategoryIds = useMemo(() => ['#A1', '#A2', '#A3', '#A4', '#A5'], []);

    const handleCategoryChange = useCallback((e) => {
        const newCategory = e.target.value;
        const isSelectedAdminCategory = adminCategoryIds.includes(newCategory);

        if (!isAdmin && isSelectedAdminCategory) {
            alert('일반 사용자는 관리자 전용 카테고리를 선택할 수 없습니다.');
            return;
        }
        setSelectedCategory(newCategory);
    }, [isAdmin, adminCategoryIds]);

    const handleFileChange = useCallback((e) => {
        setFile(e.target.files[0]);
    }, []);

    const handleSubmit = useCallback(async (isUpdate = false, boardNo = null) => {
        if (!isLoggedIn) {
             alert('게시글 작성을 위해 로그인이 필요합니다.');
             return;
        }
        if (!title.trim() || !content.trim() || !selectedCategory) {
            alert('제목, 내용, 카테고리를 모두 입력해주세요.');
            return;
        }
        
        setIsLoading(true);

        const formData = new FormData();
        // 서버 DTO 필드명(boardTitle, boardContent)에 맞춰 키 이름 변경
        const boardData = {
            boardTitle: title,
            boardContent: content,
            boardCategory: selectedCategory
        };

        formData.append('board', new Blob([JSON.stringify(boardData)], { type: 'application/json' }));
        
        if (file) {
            formData.append('upfile', file);
        }

        const url = isUpdate ? `/boards/${boardNo}` : '/boards';
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            await apiRequest(url, formData, method);
            alert(isUpdate ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
            navigate('/board'); 
        } catch (error) {
            console.error('게시글 처리 실패:', error);
            alert(`게시글 등록 실패: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [title, content, selectedCategory, file, isLoggedIn, navigate]);

    const handleDelete = useCallback(async (boardNo) => {
        if (!isLoggedIn) return;
        if (!window.confirm('정말로 삭제하시겠습니까?')) return;
        
        setIsLoading(true);
        try {
            await apiRequest(`/boards/${boardNo}`, null, 'DELETE');
            alert('삭제되었습니다.');
            navigate('/board');
        } catch (error) {
            console.error(error);
            alert(`삭제 실패: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn, navigate]);

    return {
        title, setTitle,
        content, setContent,
        selectedCategory, handleCategoryChange,
        file, handleFileChange,
        handleSubmit,
        handleDelete,
        isLoading,
        isAdmin,
        adminCategoryIds
    };
};