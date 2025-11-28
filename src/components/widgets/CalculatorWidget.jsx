import React from 'react';
import { 
  Coffee, Footprints, FileText, Zap, TreePine, Leaf, ChevronDown, ArrowRight 
} from 'lucide-react';
import { useEcoCalculator } from '../../hooks/useCalculator';

const THEME_CONFIG = {
  tumbler: {
    color: 'emerald',
    gradient: 'from-emerald-900/90 to-gray-900',
    icon: <Coffee className="w-5 h-5" />,
    question: "오늘 텀블러(다회용기)를 몇 번 사용하셨나요?",
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgBadge: 'bg-emerald-500/20'
  },
  transport: {
    color: 'blue',
    gradient: 'from-blue-900/90 to-gray-900',
    icon: <Footprints className="w-5 h-5" />,
    question: "오늘 걷거나 자전거로 얼마나 이동하셨나요?",
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    bgBadge: 'bg-blue-500/20'
  },
  receipt: {
    color: 'purple',
    gradient: 'from-purple-900/90 to-gray-900',
    icon: <FileText className="w-5 h-5" />,
    question: "오늘 전자영수증을 몇 건 발급받으셨나요?",
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgBadge: 'bg-purple-500/20'
  },
  electricity: {
    color: 'amber',
    gradient: 'from-amber-900/90 to-gray-900',
    icon: <Zap className="w-5 h-5" />,
    question: "지난달과 이번 달 전기 사용량을 비교해볼까요?", // 질문 변경
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgBadge: 'bg-amber-500/20'
  }
};

const CalculatorWidget = () => {
  const { 
    activityType, 
    inputValue, 
    elecValues, // 추가된 전기 state
    results, 
    categories, 
    setActivityType, 
    setInputValue,
    setElecValues // 추가된 전기 handler
  } = useEcoCalculator();

  const currentTheme = THEME_CONFIG[activityType] || THEME_CONFIG.tumbler;

  // 입력 폼 렌더링 함수 (일반 vs 전기 분기 처리)
  const renderInputSection = () => {
    // 1. 전기 절약 계산기 (입력창 2개)
    if (activityType === 'electricity') {
      return (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 group">
            <label className="absolute -top-6 left-1 text-xs text-gray-400">지난달 (kWh)</label>
            <input 
              type="number" 
              value={elecValues.prev} 
              onChange={(e) => setElecValues('prev', e.target.value)} 
              className={`w-full px-3 py-3 bg-black/20 border ${currentTheme.borderColor} text-white rounded-xl focus:ring-2 focus:ring-${currentTheme.color}-500 focus:outline-none text-xl font-bold text-center`} 
              placeholder="300"
            />
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
          
          <div className="relative flex-1 group">
            <label className="absolute -top-6 left-1 text-xs text-gray-400">이번달 (kWh)</label>
            <input 
              type="number" 
              value={elecValues.curr} 
              onChange={(e) => setElecValues('curr', e.target.value)} 
              className={`w-full px-3 py-3 bg-black/20 border ${currentTheme.borderColor} text-white rounded-xl focus:ring-2 focus:ring-${currentTheme.color}-500 focus:outline-none text-xl font-bold text-center`} 
              placeholder="280"
            />
          </div>
        </div>
      );
    }

    // 2. 일반 계산기 (입력창 1개)
    return (
      <div className="relative group">
        <input 
          type="number" 
          value={inputValue} 
          onChange={setInputValue} 
          className={`w-full pl-5 pr-16 py-4 bg-black/20 border ${currentTheme.borderColor} text-white rounded-xl focus:ring-2 focus:ring-${currentTheme.color}-500 focus:outline-none placeholder-gray-500 text-2xl font-bold transition-all`} 
          placeholder="0"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">
          {categories[activityType].unit}
        </span>
      </div>
    );
  };

  return (
    <div className={`col-span-12 md:col-span-6 rounded-3xl shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden bg-gradient-to-br ${currentTheme.gradient}`}>
      
      {/* 헤더 & 선택 영역 */}
      <div className="p-6 pb-4 flex justify-between items-start">
        <div>
          <div className="relative inline-block group">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="appearance-none bg-transparent text-xl font-bold text-white pr-8 py-1 focus:outline-none cursor-pointer hover:text-gray-200 transition-colors"
            >
              {Object.entries(categories).map(([key, info]) => (
                <option key={key} value={key} className="bg-gray-800 text-gray-300">
                  {info.label} 계산기
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${currentTheme.accentColor}`} />
            <div className={`h-1 w-full mt-1 rounded-full bg-gradient-to-r from-transparent via-${currentTheme.color}-500 to-transparent opacity-50`}></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">오늘의 작은 실천 기록하기</p>
        </div>
        
        <div className={`p-3 rounded-2xl ${currentTheme.bgBadge} ${currentTheme.accentColor} shadow-inner`}>
          {currentTheme.icon}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 pb-6">
        
        {/* 질문 및 입력 영역 */}
        <div className="mb-6">
          <label className="block text-lg text-white mb-8 font-medium leading-relaxed">
            Q. {currentTheme.question}
          </label>
          
          {/* 분기 처리된 입력 폼 렌더링 */}
          {renderInputSection()}

        </div>

        {/* 결과 영역 */}
        {results ? (
          <div className="space-y-3 animate-fade-in-up">
            <div className={`bg-black/30 rounded-xl p-4 border-l-4 ${currentTheme.borderColor} flex items-center justify-between`}>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">
                  {activityType === 'electricity' ? '전기 절약량' : '탄소 배출 감소'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${currentTheme.accentColor}`}>
                     {/* 전기일 때는 절감량(kWh)을 보여줄 수도 있고 탄소를 보여줄 수도 있음. 여기선 탄소 유지 */}
                     {results.co2Saved}
                  </span>
                  <span className="text-sm text-gray-400">kgCO₂</span>
                </div>
              </div>
              <Leaf className={`w-8 h-8 ${currentTheme.accentColor} opacity-80`} />
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">소나무 심기 효과</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{results.pineTrees}</span>
                  <span className="text-sm text-gray-400">그루</span>
                </div>
              </div>
              <TreePine className="w-6 h-6 text-green-400 opacity-80" />
            </div>
          </div>
        ) : (
          <div className="h-28 flex flex-col items-center justify-center text-gray-500/50 border-2 border-dashed border-gray-700/50 rounded-xl">
            <p className="text-sm">
              {activityType === 'electricity' 
                ? '지난달과 이번 달 사용량을 입력해보세요' 
                : '수치를 입력하면 결과가 나타납니다'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorWidget;