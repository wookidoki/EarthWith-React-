import React from 'react';
import { FileText, Coins, Settings } from 'lucide-react';

const TabMenu = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'activity'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}>
          <FileText className="w-5 h-5" />
          <span>내 활동</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'settings'
              ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}>
          <Settings className="w-5 h-5" />
          <span>계정 설정</span>
        </button>
      </div>
    </div>
  );
};

export default TabMenu; 