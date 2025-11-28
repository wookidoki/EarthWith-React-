import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 mt-20 pb-28 md:pb-10"> 
      <div className="max-w-[1400px] mx-auto px-8 py-10 text-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center"><Leaf className="h-6 w-6 text-white" /></div>
              <span className="text-xl font-medium text-gray-900">어스윗</span>
            </div>
            <p className="text-sm">지속 가능한 미래를 위한 연결.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/main" className="hover:text-emerald-600">메인</Link></li>
              <li><Link to="/feed" className="hover:text-emerald-600">커뮤니티</Link></li>
              <li><Link to="/news" className="hover:text-emerald-600">뉴스</Link></li>
              <li><Link to="/signup" className="hover:text-emerald-600">로그인</Link></li>
            </ul>
          </div>

          {/* ... 기타 정보 및 고객센터 (그대로 유지) ... */}
          <div>
             <h3 className="font-semibold text-gray-700 mb-3">정보</h3>
             <ul className="space-y-2 text-sm">
               <li><a href="#" className="hover:text-emerald-600">이용약관</a></li>
               <li><a href="#" className="hover:text-emerald-600">개인정보처리방침</a></li>
             </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">고객센터</h3>
            <p className="text-sm">contact@earthsweet.com</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-xs">
          <p>&copy; 2025 EcoConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;