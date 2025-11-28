import React from 'react';
import { Upload, Image, Type, AlignLeft, Save, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBoardEnroll } from '../hooks/useBoardEnroll'; 

const BoardEnrollPage = () => {
  const navigate = useNavigate();
  
  const { 
    title, setTitle, 
    content, setContent, 
    selectedCategory, 
    handleCategoryChange, 
    handleSubmit,
    handleFileChange, 
    file, 
    isLoading, 
    isAdmin // 훅에서 isAdmin 권한 정보를 받아옵니다.
  } = useBoardEnroll(); 

  const adminCategories = [
    { id: '#A1', label: '공공' }, 
    { id: '#A2', label: '에너지' }, 
    { id: '#A3', label: '자동차' }, 
    { id: '#A4', label: '일상생활' }, 
    { id: '#A5', label: '녹색소비' }
  ];
  const publicCategories = [
    { id: '#B1', label: '정보' }, 
    { id: '#B2', label: '모집' }, 
    { id: '#B3', label: '홍보' }
  ];

  const fileInputRef = React.useRef(null);
  const onFileUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/board')} className="p-2 rounded-full hover:bg-gray-200" title="목록으로 돌아가기"><ChevronLeft className="w-6 h-6 text-gray-700" /></button>
            <h1 className="text-2xl font-bold text-gray-900">콘텐츠 업로드</h1>
          </div>
          <button 
              onClick={() => handleSubmit()} 
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md flex items-center disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? '게시 중...' : '게시하기'}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* 제목 입력 필드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><Type className="w-4 h-4 mr-2 text-emerald-500" /> 제목</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)} 
                className="w-full text-xl font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-emerald-500 placeholder-gray-300" 
                placeholder="여기에 제목을 입력하세요"
            />
            </div>
            {/* 내용 입력 필드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[400px] flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-emerald-500" /> 내용</label>
              <textarea 
                value={content} 
                onChange={(e)=>setContent(e.target.value)} 
                className="w-full flex-1 resize-none border-none focus:ring-0 text-gray-700 leading-relaxed placeholder-gray-300" 
                placeholder="내용을 자유롭게 작성해주세요..."
            ></textarea>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* 이미지 업로드 섹션 */}
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
                onClick={onFileUploadClick} 
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 transition-all cursor-pointer bg-gray-50 relative"
              >
                {file ? (
                    <div className="p-4 text-center text-emerald-600 font-medium">
                        <Image className="w-8 h-8 mb-2 mx-auto" />
                        <span className="text-sm truncate block">{file.name}</span>
                    </div>
                ) : (
                    <>
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs">클릭하여 이미지 업로드</span>
                    </>
                )}
              </div>
            </div>
            
            {/* 카테고리 선택 섹션 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* [핵심 UI 분기] 관리자일 경우에만 #A 관리자 카테고리를 표시합니다. */}
              {isAdmin && (
                <>
                  <label className="block text-sm font-bold text-gray-700 mb-4">#A 관리자 게시물 (관리자 전용)</label>
                  <div className="space-y-2">
                        {adminCategories.map((cat) => (
                            <label key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="category" 
                                    value={cat.id} 
                                    checked={selectedCategory === cat.id} 
                                    onChange={handleCategoryChange} 
                                    className="text-emerald-600 focus:ring-emerald-500" 
                                />
                                <span className="text-gray-700 text-sm">{cat.label}</span>
                            </label>
                        ))}
                    </div>
                  <hr className="my-6 border-gray-200" />
                </>
              )}
              
              {/* 일반 사용자와 관리자 모두에게 보이는 공공 게시물 */}
              <label className="block text-sm font-bold text-gray-700 mb-4">#B 공공 게시물 (모두 가능)</label>
              <div className="space-y-2">
                    {publicCategories.map((cat) => (
                        <label key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input 
                                type="radio" 
                                name="category" 
                                value={cat.id} 
                                checked={selectedCategory === cat.id} 
                                onChange={handleCategoryChange} 
                                className="text-emerald-600 focus:ring-emerald-500" 
                            />
                            <span className="text-gray-700 text-sm">{cat.label}</span>
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