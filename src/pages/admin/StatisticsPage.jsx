import React from 'react';
import { TrendingUp, Users, Zap, Clock } from 'lucide-react';

// 목업 데이터 유지
const mockStats = [
  { icon: Users, title: '총 회원 수', value: '12,500명', trend: '+15% (이번 달)', color: 'bg-blue-100 text-blue-600' },
  { icon: Zap, title: '누적 포인트', value: '8.9M P', trend: '+120K (오늘)', color: 'bg-emerald-100 text-emerald-600' },
  // ...
];

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition">
    <div className={`flex items-center justify-between mb-4 ${color} p-2 rounded-lg`}>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <Icon className={`w-6 h-6 ${color.split(' ')[1]}`} />
    </div>
    <p className="text-3xl font-extrabold text-gray-900 mb-1">{value}</p>
    <p className="text-sm font-semibold">{trend}</p>
  </div>
);

const StatisticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4 flex items-center">
            <TrendingUp className="w-7 h-7 mr-2 text-blue-500" /> 서비스 통계 대시보드
          </h1>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockStats.map((stat, index) => <StatCard key={index} {...stat} />)}
        </section>
        <section className="space-y-8">
           {/* 차트 영역 Placeholder */}
           <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center text-gray-400">차트 영역</div>
        </section>
      </div>
    </div>
  );
};

export default StatisticsPage;