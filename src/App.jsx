import React, { useState } from "react";
import { 
  // Routes, Route, Link, useLocation, useNavigate는 이제 App에서만 사용합니다.
  Routes, Route, useNavigate 
} from 'react-router-dom';
// lucide-react 아이콘은 이제 MainLayout의 자식인 Navigator에서만 사용합니다.

// 페이지 컴포넌트들 (경로를 `./assets/...`로 유지하고, 누락된 확장자 명시로 수정)
import EcoLandingPage from "./assets/common/landing/EcoLandingPage.jsx"; 
import EcoMainPage from "./assets/main/EcoMainPage.jsx";                 
import EcoFeedPage from "./assets/feed/EcoFeedPage.jsx";                 
import BoardPage from "./assets/board/BoardPage.jsx";
import SignUpPage from "./assets/common/signup/SignUpPage.jsx";          
import BoardEnroll from "./assets/board/BoardEnroll.jsx";
import NewsPage from "./assets/news/NewsPage.jsx";                       
import UserFeedEnrollPage from "./assets/feed/UserFeedEnrollPage.jsx";   
import MyProfilePage from "./assets/auth/MyProfilePage.jsx"; 
import MainLayout from "./assets/main/MainLayout.jsx"; 

import BoardMagenment from "./assets/admin/BoardMagenment.jsx";       
import ScoreMagenment from "./assets/admin/ScoreMagenment.jsx";       
import Statis from "./assets/admin/Statis.jsx";                       
import ErrorPage from "./assets/util/error/Error.jsx";

//
import RegisterPage from "./assets/common/signup/EnrollForm.jsx";

// 메인 App 컴포넌트 
function App() {
  // 라우터 사용 로그인 설정값 예시 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // 초기값 유지
  
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 네비게이션 함수
  const handleNavigate = (path) => {
    navigate(path); 
    window.scrollTo(0, 0); 
  };

  // --- 로그인/로그아웃 핸들러 ---
  const handleLogin = () => { 
    setIsLoggedIn(true); 
    // TODO: 실제 사용자 정보 설정
    handleNavigate("/main"); 
  };
  
  const handleAdminLogin = () => { 
    setIsLoggedIn(true); 
    setIsAdmin(true); 
    // TODO: 실제 관리자 정보 설정
    handleNavigate("/main"); 
  };

  const handleLogout = () => { 
    setIsLoggedIn(false); 
    setIsAdmin(false); 
    // TODO: 사용자 정보 초기화
    handleNavigate("/"); // 로그아웃 후 랜딩 페이지로 이동
  };

  // MyProfilePage에서 Admin 페이지로 이동하기 위한 핸들러
  const handleNavigateToAdmin = () => {
    handleNavigate('/board'); // 관리자 페이지 기본 경로를 일반 게시판 경로로 변경
  };

  return (
    <Routes>
      {/* 1. 레이아웃이 필요 없는 독립 경로: Header, Footer, Navigator가 나타나지 않습니다. */}
      <Route path="/" element={<EcoLandingPage onNavigate={handleNavigate} />} /> 
      <Route 
        path="/signup" 
        element={<SignUpPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
      />

      {/* 2. <MainLayout> 경로: 이 라우트의 자식들은 Header, Footer, Navigator를 공통으로 사용합니다. */}
      <Route element={<MainLayout />}>
        {/* 일반 서비스 페이지 */}
        <Route 
          path="/main" 
          element={<EcoMainPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} 
        />
        <Route path="/feed" element={<EcoFeedPage onNavigate={handleNavigate} />} />
        <Route path="/news" element={<NewsPage />} />

        {/* 게시판/마이페이지 (경로 수정: /admin -> /board) */}
        <Route 
          path="/board" 
          element={<BoardPage onNavigate={handleNavigate} pageFilter={'ALL'} isAdmin={isAdmin} />} 
        />
        <Route 
          path="/board-filtered"
          element={<BoardPage onNavigate={handleNavigate} pageFilter={'A'} isAdmin={isAdmin} />} 
        />


        <Route path="/admin-enroll" element={<BoardEnroll onNavigate={handleNavigate} isAdmin={isAdmin} />} /> 
        <Route path="/user-enroll" element={<UserFeedEnrollPage onNavigate={handleNavigate} />} />
        
        <Route 
          path="/myprofile" 
          element={
            <MyProfilePage 
              onLogout={handleLogout} 
              isAdmin={isAdmin}
              onNavigateToAdmin={handleNavigateToAdmin} // 변경된 경로 반영
            />
          }
        />

        <Route path="/admin/board" element={<BoardMagenment />} />        {/* 게시글/리뷰 관리 */}
        <Route path="/admin/score" element={<ScoreMagenment />} />        {/* 인증 및 포인트 */}
        <Route path="/admin/stats" element={<Statis />} />                {/* 통계 대시보드 */}

      </Route>

      <Route path="/register" element={<RegisterPage />} /> 
      
      {/* 3. 일치하는 경로가 없을 때 (ErrorPage로 연결) */}
      <Route path="*" element={<ErrorPage onNavigate={handleNavigate} />} /> 
    </Routes>
  );
}

export default App;