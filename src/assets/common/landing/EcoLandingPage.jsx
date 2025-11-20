import React, { useState, useEffect } from 'react';
import { 
  Leaf, ChevronDown, ArrowRight, Globe, Users,
  TreePine, Wind, Sun, Award 
} from 'lucide-react';

import useClimateTime from "../../../hook/useClimateTime";

import ForestImg from "../../resources/img/forest.jpg";
import SeaImg from "../../resources/img/sea.jpg";
import SkyImg from "../../resources/img/sky.jpg"


const EcoLandingPage = ({ onNavigate }) => {
  const climateTime = useClimateTime(); 
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const [stats, setStats] = useState([
    { number: "...", label: "1.5℃ 상승까지 남은 시간" },
    { number: "...", label: "참여중인 환경 지킴이" },
    { number: "89톤", label: "이번달 CO₂ 절감량" },
    { number: "...", label: "진행중인 챌린지" }
  ]);
  
  // climateTime이 변경될 때 stats의 첫 번째 요소를 갱신
  useEffect(() => {
      setStats(prevStats => [
          { ...prevStats[0], number: climateTime },
          prevStats[1],
          prevStats[2],
          prevStats[3]
      ]);
  }, [climateTime]);

  // stats 의 두 번째 요소 
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);

    //BE 매핑 
    const API_BASE_URL = 'http://localhost:8081';
    
    const fetchMemberCount = async () => {
      try {
        const [memberCountResponse, boardCountResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/member-count`),
          fetch(`${API_BASE_URL}/stats/boards-join`)
        ]);
        
        const memberCountData = await memberCountResponse.json();
        const boardCountResponseData = await boardCountResponse.json();

        setStats(prevStats => [
          prevStats[0],
          { ...prevStats[1], number: memberCountData.memberCount.toLocaleString() },
          prevStats[2],
          {...prevStats[3], number : boardCountResponseData.boardParticipationCount.toLocaleString()}
        ]);
        
      } catch (error) {
        console.error("환경 지킴이 수 조회 에러:", error);
        setStats(prevStats => [
           prevStats[0],
           { ...prevStats[1], number: "0" }, 
           prevStats[2],
           {...prevStats[3], number: "0"}
         ]);
      }
    };

    fetchMemberCount();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
        
        <div className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={ForestImg}
            alt="푸른 숲 배경" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={SeaImg}
            alt="깨끗한 바다 배경" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === 2 ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={SkyImg}
            alt="도시 공원 배경" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="absolute inset-0 z-20 hidden md:block">
          <div 
            className="absolute top-20 left-10 opacity-20"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <Leaf className="w-24 h-24 text-white animate-pulse" />
          </div>
          <div 
            className="absolute top-40 right-20 opacity-20"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <TreePine className="w-32 h-32 text-white animate-pulse" />
          </div>
          <div 
            className="absolute bottom-40 left-32 opacity-20"
            style={{ transform: `translateY(${scrollY * -0.4}px)` }}
          >
            <Wind className="w-28 h-28 text-white animate-pulse" />
          </div>
          <div 
            className="absolute bottom-20 right-40 opacity-20"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            <Sun className="w-20 h-20 text-white animate-pulse" />
          </div>
        </div>
      </div>

      <div className="relative z-30 min-h-screen flex flex-col">
        <header className="absolute top-0 w-full p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                 <Leaf className="w-6 h-6 text-white" />
                </div>
              <span className="text-white font-medium text-lg">어스윗</span>
            </div>
            <button 
              onClick={() => onNavigate('/signup')}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-medium"
            >
              로그인
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight">
                당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-200">한 걸음</span>이
                <br />
                지구를 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">살립니다</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                환경 보존을 실천하세요. 누구나 쉽게 접근할 수 있는 탄소중립포인트
              </p>
            </div>

            <div className="mb-12">
              <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
                일상 속 작은 실천으로 만드는 큰 변화.<br />
                우리가 함께 만들어가는 지속 가능한 미래.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => onNavigate('/main')}
                className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <span>시작하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                더 알아보기
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      <div className="relative z-30 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              함께 만드는 변화
            </h2>
            <p className="text-xl text-white/70">
              실시간으로 늘어나는 우리의 긍정적 영향력
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-3">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                </div>
                <p className="text-white/70 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-30 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  지역 기반 활동
                </h3>
                <p className="text-white/70">
                  우리 동네에서 시작하는 환경 보호. 
                  지역 커뮤니티와 함께 실천하고 공유하세요.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  포인트 리워드
                </h3>
                <p className="text-white/70">
                  환경 보호 활동으로 포인트를 적립하고
                  실질적인 혜택을 받으세요.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  함께하는 챌린지
                </h3>
                <p className="text-white/70">
                  혼자가 아닌 함께. 다양한 환경 챌린지에
                  참여하고 인증을 공유하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <button 
              onClick={() => onNavigate('/main')}
              className="group inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-40 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EcoLandingPage;