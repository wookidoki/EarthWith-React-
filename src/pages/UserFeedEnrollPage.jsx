import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, Type, AlignLeft, Save, Hash, ChevronLeft } from 'lucide-react';

const UserFeedEnrollPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const categories = {
    '#C1': '인증', '#C2': '참여', '#C3': '후기', '#C4': '자유',
  };

  const handleSubmit = () => {
    alert('게시글이 등록되었습니다. (임시)');
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
             <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">피드 글쓰기</h1>
              <p className="text-gray-500 text-sm mt-1">당신의 실천을 공유해주세요.</p>
            </div>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 flex items-center">
            <Save className="w-4 h-4 mr-2" /> 게시하기
          </button>
        </div>

        <div className="space-y-6">
          {/* 카테고리 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">카테고리 (필수)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categories).map(([key, value]) => (
                <label key={key} className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCategory === key ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <input type="radio" name="category" value={key} checked={selectedCategory === key} onChange={(e) => setSelectedCategory(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                  <span className="font-medium text-gray-700">{value}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 제목 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Type className="w-4 h-4 mr-2 text-emerald-500" /> 제목</label>
            <input type="text" className="w-full text-xl font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-300" placeholder="제목을 입력하세요" />
          </div>

          {/* 내용 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[300px] flex flex-col">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-emerald-500" /> 내용</label>
            <textarea className="w-full flex-1 resize-none border-none focus:ring-0 text-gray-700 leading-relaxed placeholder-gray-300" placeholder="내용을 작성해주세요..."></textarea>
          </div>
          
          {/* 이미지 & 태그 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Image className="w-4 h-4 mr-2 text-emerald-500" /> 사진 첨부</label>
            <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-all cursor-pointer bg-gray-50">
              <Upload className="w-8 h-8 mb-2" /><span className="text-xs">클릭하여 이미지 업로드</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Hash className="w-4 h-4 mr-2 text-emerald-500" /> 태그</label>
            <input type="text" className="w-full border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:border-emerald-500 placeholder-gray-400" placeholder="#태그1 #태그2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedEnrollPage;