import React, { useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Image, Type, AlignLeft, Save, ChevronLeft, Loader2 } from 'lucide-react';
import { useBoardEnroll } from '../hooks/useBoardEnroll';

const BoardEnrollPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEditMode = location.state?.mode === 'edit';
  const existingPost = location.state?.postData;

  const { 
    title, setTitle,
    content, setContent,
    selectedCategory, setSelectedCategory,
    handleCategoryChange,
    file, handleFileChange,
    handleSubmit,
    isLoading,
    isAdmin,
    adminCategoryIds
  } = useBoardEnroll();

  // [수정] 초기값 설정 시 '#' 제거된 ID 사용
  useEffect(() => {
    if (isEditMode && existingPost) {
        setTitle(existingPost.title);
        setContent(existingPost.content);
        setSelectedCategory(existingPost.category);
    } else if (!isEditMode && !selectedCategory) {
        // 기본값 A1 또는 B1
        setSelectedCategory(isAdmin ? 'A1' : 'B1');
    }
  }, [isEditMode, existingPost, isAdmin, setTitle, setContent, setSelectedCategory]);

  const fileInputRef = useRef(null);
  
  const onSaveClick = () => {
      handleSubmit(isEditMode, existingPost?.boardNo);
  };

  // [수정] 화면 표시용 카테고리 ID에서도 '#' 제거
  const publicCategories = [
    { id: 'B1', label: '정보' }, 
    { id: 'B2', label: '모집' }, 
    { id: 'B3', label: '홍보' }
  ];

  const adminCategoriesUI = [
    { id: 'A1', label: '공공' }, 
    { id: 'A2', label: '에너지' }, 
    { id: 'A3', label: '자동차' }, 
    { id: 'A4', label: '일상생활' }, 
    { id: 'A5', label: '녹색소비' }
  ];

  const previewUrl = file ? URL.createObjectURL(file) : (isEditMode ? existingPost?.img : null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? '게시글 수정' : '콘텐츠 업로드'}
            </h1>
          </div>
          <button 
              onClick={onSaveClick} 
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md flex items-center disabled:bg-emerald-400"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="w-4 h-4 mr-2" />}
            {isLoading ? '처리 중...' : (isEditMode ? '수정하기' : '등록하기')}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Type className="w-4 h-4 mr-2 text-emerald-500" /> 제목</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full text-xl font-bold border-b border-gray-200 py-2 focus:outline-none placeholder-gray-300" 
                placeholder="제목을 입력하세요"
            />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[400px] flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-emerald-500" /> 내용</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="w-full flex-1 resize-none border-none focus:ring-0 text-gray-700 leading-relaxed placeholder-gray-300" 
                placeholder="내용을 입력하세요..."
            ></textarea>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Image className="w-4 h-4 mr-2 text-emerald-500" /> 대표 이미지</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                onClick={() => fileInputRef.current.click()} 
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 overflow-hidden relative"
              >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs">클릭하여 이미지 업로드</span>
                    </>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {isAdmin && (
                <>
                  <label className="block text-sm font-bold text-gray-700 mb-4">관리자 카테고리</label>
                  <div className="space-y-2 mb-6">
                    {adminCategoriesUI.map((cat) => (
                      <label key={cat.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer">
                        <input 
                            type="radio" 
                            name="category" 
                            value={cat.id} 
                            checked={selectedCategory === cat.id} 
                            onChange={handleCategoryChange} 
                            className="text-emerald-600" 
                        />
                        <span className="text-sm">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                  <hr className="my-6 border-gray-200" />
                </>
              )}
              
              <label className="block text-sm font-bold text-gray-700 mb-4">공공 카테고리</label>
              <div className="space-y-2">
                {publicCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="radio" 
                        name="category" 
                        value={cat.id} 
                        checked={selectedCategory === cat.id} 
                        onChange={handleCategoryChange} 
                        className="text-emerald-600" 
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardEnrollPage;