import React from 'react';
import { CheckSquare, Zap, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import { useScoreManagement } from '../../hooks/useScoreManagement';

const ScoreManagementPage = () => {
  const {
    filteredPosts, selectedType, expandedId,
    setSelectedType, toggleExpand,
    handleTypeChange, handleScoreGrant
  } = useScoreManagement();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4 flex items-center">
            <CheckSquare className="w-7 h-7 mr-2 text-orange-500" /> 인증 대기 및 포인트 부여
          </h1>
        </header>
        
        {/* 필터 버튼 */}
        <div className="flex space-x-2 mb-6">
           {['ALL', 'FEED', 'BOARD'].map(type => (
             <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 rounded ${selectedType===type ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
               {type}
             </button>
           ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
             {/* 테이블 헤더 및 바디 (ScoreMagenment.jsx 참조) */}
             <tbody className="bg-white divide-y divide-gray-200">
               {filteredPosts.map(post => (
                 <React.Fragment key={post.id}>
                   <tr className="hover:bg-gray-50">
                     <td className="px-6 py-4">{post.author}</td>
                     <td className="px-6 py-4">{post.title}</td>
                     <td className="px-6 py-4">
                       <button onClick={() => toggleExpand(post.id)} className="text-orange-600 flex items-center">
                         {expandedId === post.id ? '닫기' : '관리'}
                       </button>
                     </td>
                   </tr>
                   {expandedId === post.id && (
                     <tr className="bg-orange-50">
                       <td colSpan="3" className="p-4">
                         {/* 점수 부여 버튼들 */}
                         <div className="flex gap-2">
                           {[10, 20, 30].map(score => (
                             <button key={score} onClick={() => handleScoreGrant(post.id, score)} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">+{score}점</button>
                           ))}
                         </div>
                       </td>
                     </tr>
                   )}
                 </React.Fragment>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreManagementPage;