import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';

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
import ProfileHeader from "./pages/ProfileHeader";

import UserFeedEditPage from "./pages/UserFeedEditPage";
import ErrorPage from "./pages/ErrorPage";

// --- Admin Pages ---
import BoardManagementPage from "./pages/admin/BoardManagementPage";
import ScoreManagementPage from "./pages/admin/ScoreManagementPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import NoticeManagementPage from "./pages/admin/NoticeManagementPage";

// const ErrorPage = () => <div className="p-10 text-center">404 Not Found</div>;

function App() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path); 
    window.scrollTo(0, 0); 
  };

  return (
    <Routes>
      {/* 1. Independent Routes */}
      <Route path="/" element={<EcoLandingPage onNavigate={handleNavigate} />} /> 
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/login" element={<SignUpPage />} /> 

      {/* 2. Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/main" element={<EcoMainPage />} /> 
        <Route path="/feed" element={<EcoFeedPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/user-enroll" element={<UserFeedEnrollPage />} />
        
        {/* Board */}
        <Route path="/board" element={<BoardPage pageFilter={'ALL'} />} />
        <Route path="/board-filtered" element={<BoardPage pageFilter={'A'} />} />
        <Route path="/board-detail/:id" element={<BoardDetail />} />

        <Route path="/admin-enroll" element={<BoardEnrollPage onNavigate={handleNavigate} isAdmin={true} />} /> 
        <Route path="/feed-edit/:id" element={<UserFeedEditPage />} />

        
        {/* 글 작성 페이지 */}
        <Route path="/board-enroll" element={<BoardEnrollPage />} /> 

        
        {/* Profile */}
        <Route path="/myprofile" element={<MyProfilePage />} />
        
        {/* Admin */}
        <Route path="/admin/board" element={<BoardManagementPage />} />
        <Route path="/admin/score" element={<ScoreManagementPage />} />
        <Route path="/admin/stats" element={<StatisticsPage />} />
        <Route path="/admin/notice" element={<NoticeManagementPage />} />
      
        {/* 3. 404 에러페이지 전역처리 */}
        <Route path="*" element={<ErrorPage path={/* 현재 경로를 알려주고 싶으면 */ window.location.pathname} />} />

      </Route>
    </Routes>
  );
}

export default App;