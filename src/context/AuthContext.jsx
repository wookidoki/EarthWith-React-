import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ⭐ true → false로 변경

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


  // ⭐ 앱 시작 시 localStorage에서 모든 정보 복원
  useEffect(() => {
    const storedMemberNo = localStorage.getItem('memberNo');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('role');
    
    console.log('🔄 AuthContext 초기화 시작');
    console.log('storedMemberNo:', storedMemberNo);
    console.log('storedAccessToken:', storedAccessToken);
    console.log('storedRole:', storedRole);
    
    if (storedMemberNo && storedAccessToken) {
      // ⭐ localStorage에서 모든 사용자 정보 복원
      const restoredAuth = {
        memberNo: storedMemberNo,
        role: storedRole,
        memberImage: localStorage.getItem('memberImage'),
        phone: localStorage.getItem('phone'),
        refRno: localStorage.getItem('refRno'),
        memberName: localStorage.getItem('memberName'),
        accessToken: storedAccessToken,
        enrollDate: localStorage.getItem('enrollDate'),
        email: localStorage.getItem('email'),
        refreshToken: localStorage.getItem('refreshToken'),
        memberId: localStorage.getItem('memberId'),
        memberPoint: localStorage.getItem('memberPoint'),
        isAuthenticated: true
      };
      
      console.log('✅ 복원된 인증 정보:', restoredAuth);
      
      setAuth(restoredAuth);
      setIsLoggedIn(true);
      setIsAdmin(storedRole === 'ROLE_ADMIN');
      
      // currentUser도 복원
      setCurrentUser({
        memberNo: storedMemberNo,
        memberName: localStorage.getItem('memberName'),
        email: localStorage.getItem('email'),
        phone: localStorage.getItem('phone'),
        memberPoint: localStorage.getItem('memberPoint'),
        memberImage: localStorage.getItem('memberImage'),
        enrollDate: localStorage.getItem('enrollDate')
      });
      
      console.log('✅ 로그인 상태 복원 완료');
    } else {
      console.log('❌ 저장된 인증 정보 없음');
    }
  }, []); // 빈 배열 - 마운트 시 한 번만 실행

// 로컬 로그인 처리
const login = (memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint) => {
  console.log('🔐 로그인 처리 시작');
  console.log('받은 memberImage:', memberImage); // ⭐ 확인
  
  const authData = {
    memberNo, 
    role, 
    memberImage,  // ⭐ 이 값이 제대로 들어오는지 확인
    phone, 
    refRno, 
    memberName, 
    accessToken, 
    enrollDate, 
    email, 
    refreshToken, 
    memberId, 
    memberPoint,
    isAuthenticated: true,

  // [추가] 새로고침 시 로컬 스토리지 체크 및 로그인 상태 복구
  /*
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    
    // 토큰이 존재하면 로그인 상태로 간주하고 상태 복구
    if (storedToken) {
      const storedMemberId = localStorage.getItem("memberId");
      const storedRole = localStorage.getItem("role");
      const storedMemberNo = localStorage.getItem("memberNo");
      const storedMemberName = localStorage.getItem("memberName");
      const storedMemberPoint = localStorage.getItem("memberPoint");
      
      // 1. Auth 상태 복구
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

      // 2. 로그인 여부 및 관리자 여부 복구
      setIsLoggedIn(true);
      setIsAdmin(storedRole === 'ROLE_ADMIN');
      
      // 3. CurrentUser 복구 (헤더 등 UI 표시용)
      setCurrentUser({
        memberId: storedMemberId,
        memberName: storedMemberName,
        role: storedRole,
        memberNo: storedMemberNo,
        memberPoint: storedMemberPoint
      });
    }
  }, []); // 빈 배열([])을 넣어 컴포넌트가 처음 나타날 때 딱 한 번만 실행되게 함

  // 로컬 로그인 처리
  const login = (memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint) => {
    // 1. 사용자 정보를 객체로 묶음
    const userObj = {
      memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint,
      isAuthenticated: true,
    };

    // 2. 상태 업데이트
    setAuth(userObj);
    setIsLoggedIn(true);
    setIsAdmin(role === 'ROLE_ADMIN'); 
    
    // [핵심 수정] Header 컴포넌트가 감지할 수 있도록 currentUser 업데이트
    setCurrentUser(userObj);

    // 3. 로컬 스토리지 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberId", memberId);
    localStorage.setItem("role", role);
    localStorage.setItem("memberNo", memberNo);
    localStorage.setItem("memberName", memberName);
    localStorage.setItem("memberPoint", memberPoint);
    */

  };
  
  setAuth(authData);
  setIsLoggedIn(true);
  setIsAdmin(role === 'ROLE_ADMIN'); 

  // ⭐ localStorage에 모든 정보 저장
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
  localStorage.setItem("memberImage", memberImage || ''); // ⭐ 추가
  localStorage.setItem("refRno", refRno || ''); // ⭐ 추가

  console.log('✅ localStorage 저장 완료!');
  console.log('memberImage:', localStorage.getItem('memberImage')); // ⭐ 확인
};

  // 로그아웃 처리
  const logout = async () => {
    console.log('🚪 로그아웃 처리 시작');
    
    const logoutId = localStorage.getItem("memberId");
    const logoutToken = localStorage.getItem("refreshToken");

    try {
      await axios.post("http://localhost:8081/auth/logout", {
        memberId: logoutId,
        refreshToken: logoutToken
      });
      console.log('✅ 서버 로그아웃 성공');
    } catch (error) {
      console.error("❌ 서버 로그아웃 오류:", error);
    }

    // ⭐ 상태 초기화
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

    // ⭐ localStorage 완전히 삭제
/*
    // 상태 초기화
    setAuth({ isAuthenticated: false });
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null); // [핵심 수정] 로그아웃 시 currentUser 초기화
    
*/
    localStorage.clear();
    
    console.log('✅ 로그아웃 완료');
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
      isLoggedIn, 
      isAdmin, 
      currentUser, 
      auth, 
      login, 
      logout, 
      handleLogin, 
      handleAdminLogin 
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