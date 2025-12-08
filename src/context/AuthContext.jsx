import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:8081'; // 주소 상수화

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    memberNo: null,
    role: null,
    memberImage: null,
    phone: null,
    refRno: null,
    memberName: null,
    accessToken: null,
    enrollDate: null,
    email: null,
    refreshToken: null,
    memberId: null,
    memberPoint: null,
    isAuthenticated: false
  });

  // [유지] 새로고침 시 로컬 스토리지 체크 및 로그인 상태 복구
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    
    if (storedToken) {
      const storedMemberId = localStorage.getItem("memberId");
      const storedRole = localStorage.getItem("role");
      const storedMemberNo = localStorage.getItem("memberNo");
      const storedMemberName = localStorage.getItem("memberName");
      const storedMemberPoint = localStorage.getItem("memberPoint");
      
      setAuth(prev => ({
        ...prev,
        accessToken: storedToken,
        memberId: storedMemberId,
        role: storedRole,
        memberNo: storedMemberNo,
        memberName: storedMemberName,
        memberPoint: storedMemberPoint,
        isAuthenticated: true
      }));

      setIsLoggedIn(true);
      setIsAdmin(storedRole === 'ROLE_ADMIN');
      
      setCurrentUser({
        memberId: storedMemberId,
        memberName: storedMemberName,
        role: storedRole,
        memberNo: storedMemberNo,
        memberPoint: storedMemberPoint
      });
      
      // Axios 기본 헤더 설정 추가 (새로고침 후에도 유지되도록)
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []); 

  // [유지] 로컬 로그인 처리
  const login = (memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint) => {
    const userObj = {
      memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint,
      isAuthenticated: true,
    };

    setAuth(userObj);
    setIsLoggedIn(true);
    setIsAdmin(role === 'ROLE_ADMIN'); 
    setCurrentUser(userObj);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberId", memberId);
    localStorage.setItem("role", role);
    localStorage.setItem("memberNo", memberNo);
    localStorage.setItem("memberName", memberName);
    localStorage.setItem("memberPoint", memberPoint);

    // 로그인 직후 헤더 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  // [수정] 로그아웃 처리 (헤더 추가 및 에러 처리 강화)
  const logout = async () => {
    const logoutId = localStorage.getItem("memberId");
    const logoutToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken"); // 헤더용 토큰

    try {
      if (logoutId && logoutToken) {
        // 백엔드 MemberLogoutDTO 필드에 맞춰 데이터 전송
        await axios.post(`${API_BASE_URL}/auth/logout`, 
          {
            memberId: logoutId,
            refreshToken: logoutToken
          },
          {
            headers: {
              // 백엔드 필터 통과를 위해 토큰 헤더 추가
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json'
            }
          }
        );
        console.log("서버 로그아웃 성공");
      }
    } catch (error) {
      console.error("서버 로그아웃 오류 (무시하고 진행):", error);
    } finally {
      // 서버 응답과 관계없이 클라이언트 상태는 무조건 초기화
      setAuth({ isAuthenticated: false });
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCurrentUser(null);
      
      localStorage.clear();
      delete axios.defaults.headers.common['Authorization']; // 헤더 삭제
      
      navigate("/main");
    }
  };

  // [유지] 임시 핸들러
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    navigate("/main");
  };
  
  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    navigate("/main");
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, isAdmin, currentUser, auth, 
      login, logout, handleLogin, handleAdminLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};