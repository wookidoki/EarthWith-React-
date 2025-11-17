import React, { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from "../../auth/authContext/AuthorContext.jsx"; 
import { useNavigate } from 'react-router-dom'; 


const SignUpPage = () => {
  const navigate = useNavigate(); 
  const { handleLogin, handleAdminLogin } = useAuth();
  
  // 회원가입 페이지로 이동 핸들러
  const handleRegisterClick = (e) => {
    e.preventDefault(); 
    navigate('/register'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 m-4">
        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">어스윗</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h2>
        <p className="text-center text-gray-500 mb-8">
          로그인하고 더 많은 기능을 이용하세요.
        </p>

        {/* TODO: (AXIOS) form submit 시 (onSubmit) handleLogin/handleAdminLogin 대신
          실제 API로 이메일/비밀번호를 전송하는 로직이 필요합니다.
          현재는 버튼 클릭으로 임시 로그인합니다.
        */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* 이메일 입력 */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="you@example.com"
              // onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="••••••••"
              // onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                로그인 유지
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                비밀번호 찾기
              </a>
            </div>
          </div>

          {/* 일반 로그인 버튼 */}
          <button
            type="button" 
            onClick={handleLogin} 
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-bold transition-all"
          >
            로그인
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          {/* 테스트용 관리자 로그인 버튼 */}
          <button
            type="button" 
            onClick={handleAdminLogin}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all"
          >
            (테스트용) 관리자 로그인
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <a 
            href="#" 
            onClick={handleRegisterClick} 
            className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;