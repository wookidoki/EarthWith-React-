import React from "react";
import { Link } from "react-router-dom";
import { Leaf, AlertTriangle } from "lucide-react";

const ErrorPage = ({ path }) => {
  return (
    // min-h-screen을 추가하여 화면 전체 높이를 차지하게 수정 (중앙 정렬 완벽 지원)
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center px-6">

      {/* 상단 아이콘 */}
      <div className="w-24 h-24 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-8 border border-emerald-100 animate-bounce-slow">
        <AlertTriangle className="h-10 w-10 text-emerald-500" />
      </div>

      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        페이지를 찾을 수 없어요
      </h1>

      {/* 설명 */}
      <p className="text-gray-600 text-lg text-center leading-relaxed mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었어요.
        <br className="hidden md:block" />
        주소를 다시 확인하거나 홈으로 이동해주세요.
      </p>

      {/* 요청 path 노출 (있을 경우에만 박스 형태로 표시) */}
      {path && (
        <div className="mb-8 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            요청 경로: <span className="font-mono text-emerald-600 font-medium">{path}</span>
          </p>
        </div>
      )}

      {/* 메인으로 돌아가기 버튼 */}
      <Link
        to="/main"
        className="px-8 py-4 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all font-bold text-lg mb-12 flex items-center gap-2 transform hover:-translate-y-1"
      >
        메인 화면으로 이동
      </Link>

      {/* Footer 브랜드 로고 */}
      <div className="absolute bottom-10 flex items-center space-x-2 text-gray-400 opacity-80">
        <Leaf className="h-5 w-5 text-emerald-500" />
        <span className="font-semibold text-sm tracking-widest">EarthWith</span>
      </div>
    </div>
  );
};

export default ErrorPage;