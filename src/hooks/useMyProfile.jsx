import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useMyProfile = () => {
  const navigate = useNavigate();
  const { logout, isAdmin, currentUser, auth } = useAuth();

  // 로그아웃 처리
  const handleLogout = () => {
    logout(); // AuthContext의 logout 함수 호출
    // navigate('/')는 AuthContext 내부나 App.jsx 라우팅 흐름에 맡길 수 있음
  };

  // 관리자 페이지 이동
  const handleNavigateToAdmin = () => {
    navigate('/admin/board');
  };

  return {
    currentUser: currentUser || auth, // AuthContext 구조에 따라 조정
    isAdmin,
    handleLogout,
    handleNavigateToAdmin
  };
};