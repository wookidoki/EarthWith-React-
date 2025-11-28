import React from 'react';
import { Upload, Image, Type, AlignLeft, Save, ChevronLeft } from 'lucide-react';
import { useBoardEnroll } from '../hooks/useBoardEnroll';

const BoardEnrollPage = ({ onNavigate, isAdmin }) => {
  const { title, setTitle, content, setContent, selectedCategory, handleCategoryChange, handleSubmit } = useBoardEnroll(isAdmin);

  const adminCategories = [{ id: '#A1', label: '공공' }, { id: '#A2', label: '에너지' }, { id: '#A3', label: '자동차' }, { id: '#A4', label: '일상생활' }, { id: '#A5', label: '녹색소비' }];
  const publicCategories = [{ id: '#B1', label: '정보' }, { id: '#B2', label: '모집' }, { id: '#B3', label: '홍보' }];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate('admin')} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft className="w-6 h-6 text-gray-700" /></button>
            <h1 className="text-2xl font-bold text-gray-900">콘텐츠 업로드</h1>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md flex items-center"><Save className="w-4 h-4 mr-2" /> 게시하기</button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Type className="w-4 h-4 mr-2 text-emerald-500" /> 제목</label>
              <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full text-xl font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-emerald-500 placeholder-gray-300" placeholder="여기에 제목을 입력하세요"/>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[400px] flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-emerald-500" /> 내용</label>
              <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="w-full flex-1 resize-none border-none focus:ring-0 text-gray-700 leading-relaxed placeholder-gray-300" placeholder="내용을 자유롭게 작성해주세요..."></textarea>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Image className="w-4 h-4 mr-2 text-emerald-500" /> 대표 이미지</label>
              <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 transition-all cursor-pointer bg-gray-50"><Upload className="w-8 h-8 mb-2" /><span className="text-xs">클릭하여 이미지 업로드</span></div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {isAdmin && (
                <>
                  <label className="block text-sm font-bold text-gray-700 mb-4">#A 관리자 게시물</label>
                  <div className="space-y-2">{adminCategories.map((cat) => <label key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="radio" name="category" value={cat.id} checked={selectedCategory === cat.id} onChange={handleCategoryChange} className="text-emerald-600 focus:ring-emerald-500" /><span className="text-gray-700 text-sm">{cat.label}</span></label>)}</div>
                  <hr className="my-6 border-gray-200" />
                </>
              )}
              <label className="block text-sm font-bold text-gray-700 mb-4">#B 공공 게시물</label>
              <div className="space-y-2">{publicCategories.map((cat) => <label key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="radio" name="category" value={cat.id} checked={selectedCategory === cat.id} onChange={handleCategoryChange} className="text-emerald-600 focus:ring-emerald-500" /><span className="text-gray-700 text-sm">{cat.label}</span></label>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardEnrollPage;