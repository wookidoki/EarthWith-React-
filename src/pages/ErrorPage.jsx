import React from "react";
import { Link } from "react-router-dom";
import { Leaf, AlertTriangle } from "lucide-react";

const ErrorPage = ({ path }) => {
  return (
    <div className="w-full bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center px-6 py-0">

      {/* 상단 아이콘 */}
      <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 mt-10">
        <AlertTriangle className="h-10 w-10 text-emerald-600" />
      </div>

      {/* 제목 */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        페이지를 찾을 수 없어요
      </h1>

      {/* 설명 */}
      <p className="text-gray-600 text-lg text-center leading-relaxed mb-6 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었어요.
        <br />
        계속 문제가 발생하면 관리자에게 문의해주세요.
      </p>

      {/* 요청 path 노출 */}
      {path && (
        <p className="text-sm text-gray-500 mb-8">
          요청 경로: <span className="font-medium">{path}</span>
        </p>
      )}

      {/* 메인으로 돌아가기 */}
      <Link
        to="/main"
        className="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-md hover:bg-gray-800 transition-all font-medium mb-12"
      >
        메인 화면으로 이동
      </Link>

      {/* Footer 위에 브랜드 느낌 */}
      <div className="flex items-center space-x-2 mb-6 text-gray-500">
        <Leaf className="h-5 w-5 text-emerald-500" />
        <span className="font-semibold">어스윗</span>
      </div>
    </div>
  );
};

export default ErrorPage;
