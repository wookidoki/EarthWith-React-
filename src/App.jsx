import React from "react";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// --- Layout ---
import MainLayout from "./components/layout/MainLayout";

// --- Pages ---
import EcoLandingPage from "./pages/EcoLandingPage"; 
import SignUpPage from "./pages/SignUpPage";            
import RegisterPage from "./pages/RegisterPage"; 
import EcoMainPage from "./pages/EcoMainPage";                 
import EcoFeedPage from "./pages/EcoFeedPage";                 
import UserFeedEnrollPage from "./pages/UserFeedEnrollPage";   
import BoardPage from "./pages/BoardPage";
import BoardEnrollPage from "./pages/BoardEnrollPage";
import BoardDetail from "./pages/BoardDetail";
import NewsPage from "./pages/NewsPage";
import MyProfilePage from "./pages/MyProfilePage";
// import ProfileHeader from "./pages/ProfileHeader"; // 필요 시 주석 해제

import UserFeedEditPage from "./pages/UserFeedEditPage";
import ErrorPage from "./pages/ErrorPage"; // 새로 만든 ErrorPage import

// --- Admin Pages ---
import BoardManagementPage from "./pages/admin/BoardManagementPage";
import ScoreManagementPage from "./pages/admin/ScoreManagementPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import NoticeManagementPage from "./pages/admin/NoticeManagementPage";

function App() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path); 
    window.scrollTo(0, 0); 
  };

  return (
    <Routes>
      {/* 1. Independent Routes (레이아웃 없음) */}
      <Route path="/" element={<EcoLandingPage onNavigate={handleNavigate} />} /> 
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/login" element={<SignUpPage />} /> 

      {/* 2. Main Layout Routes (네비게이터 포함) */}
      <Route element={<MainLayout />}>
        <Route path="/main" element={<EcoMainPage />} /> 
        <Route path="/feed" element={<EcoFeedPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/user-enroll" element={<UserFeedEnrollPage />} />
        <Route path="/feed-edit/:id" element={<UserFeedEditPage />} />
        
        {/* --- 게시판 라우팅 --- */}
        
        {/* 일반 커뮤니티 게시판 (pageFilter="B") */}
        <Route path="/board" element={<BoardPage pageFilter={'B'} />} />
        
        {/* 공지사항/관리자 게시판 (pageFilter="A") */}
        <Route path="/board-filtered" element={<BoardPage pageFilter={'A'} />} />
        
        {/* 게시글 상세 */}
        <Route path="/board-detail/:id" element={<BoardDetail />} />
        
        {/* 글 작성 페이지 */}
        <Route path="/board-enroll" element={<BoardEnrollPage />} /> 
        
        {/* 관리자용 글 작성 (필요 시 별도 라우트 유지, BoardEnrollPage 내부 로직으로도 커버 가능) */}
        <Route path="/admin-enroll" element={<BoardEnrollPage isAdmin={true} />} /> 

        
        {/* --- 프로필 --- */}
        <Route path="/myprofile" element={<MyProfilePage />} />
        
        {/* --- 관리자 페이지 --- */}
        <Route path="/admin/board" element={<BoardManagementPage />} />
        <Route path="/admin/score" element={<ScoreManagementPage />} />
        <Route path="/admin/stats" element={<StatisticsPage />} />
        <Route path="/admin/notice" element={<NoticeManagementPage />} />
      
        {/* 3. 404 에러페이지 전역처리 */}
        <Route path="*" element={<ErrorPage path={window.location.pathname} />} />

      </Route>
    </Routes>
  );
}

export default App;