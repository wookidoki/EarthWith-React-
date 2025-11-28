import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const LocalEcoCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="col-span-12 md:col-span-8 row-span-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-emerald-200">
      <div className="relative z-10 h-full flex flex-col justify-between min-h-[400px]"> 
        <div>
          <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/50">
            <MapPin className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-4xl font-semibold text-white mb-3">우리지역<br />환경지킴이</h2>
          <p className="text-white/80 text-lg">지역 커뮤니티와 함께하는 환경 활동</p>
        </div>
        <div className="flex flex-row items-center space-x-8 mt-8">
          <div><div className="text-3xl font-semibold text-white">1,234</div><div className="text-sm text-white/70">참여자</div></div>
          <div><div className="text-3xl font-semibold text-white">89</div><div className="text-sm text-white/70">활동</div></div>
          <button onClick={() => navigate('/feed')} className="w-auto ml-auto bg-white text-emerald-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 font-bold shadow-md">
            <span>입장하기</span><ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalEcoCard;