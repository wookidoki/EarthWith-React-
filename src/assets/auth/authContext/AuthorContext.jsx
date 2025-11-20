import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// src/assets/auth/authContext/AuthorContext.jsx -> /context/AuthContext.jsx 로 경로 통일
// 현재 로그인 상태 및 권환확인용 컴포넌트 

// 1. Context 생성
export const AuthContext = createContext();

// 2. Context를 "제공"하는 Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // 기본값을 true로 유지
  // TODO: 실제 앱에서는 이 기본값을 false로 변경해야 합니다.
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();


  const [auth, setAuth ] = useState({
        memberNo : null,
        role : null,
        memberImage : null,
        phone : null,
        refRno : null,
        memberName : null,
        accessToken : null,
        enrollDate : null,
        email : null,
        refreshToken : null,
        memberId : null,
        memberPoint : null,
        isAuthenticated : false
    });

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData); 
    // TODO: isAdmin 로직은 userData에서 가져와야 함
    // 예: setIsAdmin(userData.role === 'admin');
    navigate("/main");
  };
  
  const handleAdminLogin = (adminData) => { 
    setIsLoggedIn(true); 
    setIsAdmin(true); 
    setCurrentUser(adminData);
    navigate("/main"); 
  };

  const handleLogout = () => { 
    setIsLoggedIn(false); 
    setIsAdmin(false); 
    setCurrentUser(null);
    navigate("/main"); 
  };

  const login = (memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint) => {
    setAuth({
        memberNo,
        role,
        memberImage,
        phone,
        refRno,
        memberName,
        accessToken,
        enrollDate,
        email,
        refreshToken,
        memberId,
        memberPoint,
        isAuthenticated : true,
        });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberId", memberId);
    localStorage.setItem("memberName", memberName);
    localStorage.setItem("memberNo", memberNo);
    localStorage.setItem("memberImage", memberImage);
    localStorage.setItem("phone", phone);
    localStorage.setItem("refRno", refRno);
    localStorage.setItem("enrollDate", enrollDate);
    localStorage.setItem("email", email);
    localStorage.setItem("memberPoint", memberPoint);
    localStorage.setItem("role", role);
  };

  const logoutServer = async (memberId, refreshToken) => {
  try {
    await axios.post("http://localhost:8081/auth/logout", {
      memberId,
      refreshToken
    });
  } catch (error) {
    console.error("서버 로그아웃 오류:", error);
  }
};

  const logout = async () => {

    const logoutId = localStorage.getItem("memberId");
    const logoutToken = localStorage.getItem("refreshToken");

    await logoutServer(logoutId, logoutToken);
    
    localStorage.clear();
    navigate("/main");
};

  // 3. Context가 제공할 값들을 정의
  const value = {
    isLoggedIn,
    isAdmin,
    currentUser,
    auth,
    handleLogin,
    handleAdminLogin,
    handleLogout,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, currentUser, auth, handleLogin, handleAdminLogin, handleLogout, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Context를 "사용"하는 커스텀 훅
// (컴포넌트에서 쉽게 값을 꺼내 쓸 수 있게 함)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



