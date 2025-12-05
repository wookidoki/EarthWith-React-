import React, { createContext, useState, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // 개발용 true
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

// ⭐ 앱 시작 시 localStorage에서 복원
  useEffect(() => {
    const storedMemberNo = localStorage.getItem('memberNo');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('role');
    
    if (storedMemberNo && storedAccessToken) {
      setAuth(prev => ({
        ...prev,
        memberNo: storedMemberNo,
        accessToken: storedAccessToken,
        role: storedRole,
        isAuthenticated: true
      }));
      setIsLoggedIn(true);
      setIsAdmin(storedRole === 'ROLE_ADMIN');
      
      console.log('✅ 로그인 상태 복원:', storedMemberNo);
    }
  }, []);

  // 로컬 로그인 처리
  const login = (memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint) => {
    setAuth({
      memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint,
      isAuthenticated: true,
    });
    setIsLoggedIn(true);
    // isAdmin 로직 예시: role이 'ROLE_ADMIN'이면 true
    setIsAdmin(role === 'ROLE_ADMIN'); 

    // 로컬 스토리지에 모든 정보 저장 
    localStorage.setItem("memberNo", memberNo); 
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberId", memberId);
    localStorage.setItem("role", role);
    localStorage.setItem("memberName", memberName);
    localStorage.setItem("email", email);
    localStorage.setItem("memberPoint", memberPoint);
    localStorage.setItem("phone", phone);
    localStorage.setItem("enrollDate", enrollDate);
  
    console.log('localStorage에 저장 완료!');
    console.log('memberNo:', localStorage.getItem('memberNo'));
    console.log('accessToken:', localStorage.getItem('accessToken'));
  };

  // 로그아웃 처리
  const logout = async () => {
    const logoutId = localStorage.getItem("memberId");
    const logoutToken = localStorage.getItem("refreshToken");

    try {
      await axios.post("http://localhost:8081/auth/logout", {
        memberId: logoutId,
        refreshToken: logoutToken
      });
    } catch (error) {
      console.error("서버 로그아웃 오류:", error);
    }

    setAuth({ 
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
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);

    localStorage.clear();
    navigate("/main");
  };

  // 임시 핸들러 (App.jsx 호환용)
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