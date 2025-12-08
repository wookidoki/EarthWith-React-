import React from "react";
import { Leaf, XCircle } from "lucide-react";

const ErrorModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
      <div className="bg-white w-11/12 max-w-md rounded-2xl shadow-2xl p-8 relative animate-fadeIn">

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* 로고 + 어스윗 */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">어스윗</h2>
        </div>

        {/* 에러 메시지 */}
        <div className="text-center space-y-4">
          
          <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-md"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};

export default ErrorModal;