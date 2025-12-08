import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useLogin } from '../hooks/useLogin'; // Hook import 경로 확인

const SignUpPage = () => {
  const navigate = useNavigate(); 
  
  // 커스텀 훅 사용
  const { credentials, errors, handleChange, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 m-4">
        {/* 로고 영역 */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">어스윗</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h2>
        <p className="text-center text-gray-500 mb-8">로그인하고 더 많은 기능을 이용하세요.</p>

        {/* 로그인 폼 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input 
              name="memberId" 
              required 
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 
                ${errors.id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              placeholder="ID" 
              onChange={handleChange} 
              value={credentials.memberId}
            />
            {errors.id && <p className="text-red-500 text-xs mt-1 pl-1">{errors.id}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              name="memberPwd" 
              type="password" 
              required 
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500
                ${errors.pwd ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              placeholder="password" 
              onChange={handleChange}
              value={credentials.memberPwd}
            />
            {errors.pwd && <p className="text-red-500 text-xs mt-1 pl-1">{errors.pwd}</p>}
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

          {/* 로그인 버튼 */}
          <button 
            type="submit" 
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 font-bold transition-all"
          >
            로그인 <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <span 
            onClick={() => navigate('/register')} 
            className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer"
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;