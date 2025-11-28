import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Home, PlusSquare, User, Newspaper, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigator = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const getButtonClass = (path) => {
    const baseNav = path.split('-')[0]; 
    // 로직 유지
    if (path === '/admin' && location.pathname === '/admin-filtered') return "text-gray-400 hover:text-gray-600";
    if (path === '/admin-filtered' && location.pathname === '/admin') return "text-gray-400 hover:text-gray-600";
    return location.pathname === path ? "text-emerald-600" : "text-gray-400 hover:text-gray-600";
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/50 z-50 flex items-center space-x-6 md:space-x-8">
      <Link to="/main" className={`${getButtonClass("/main")} transition-colors`}><LayoutGrid className="w-6 h-6" /></Link>
      <Link to="/feed" className={`${getButtonClass("/feed")} transition-colors`}><Home className="w-6 h-6" /></Link>
      <Link to="/news" className={`${getButtonClass("/news")} transition-colors`}><Newspaper className="w-6 h-6" /></Link>
      <Link to="/board" className={`${getButtonClass("/board")} transition-colors`}><Building2 className="w-6 h-6" /></Link>
      <Link to="/board-filtered" className={`${getButtonClass("/board-filtered")} transition-colors`}><PlusSquare className="w-6 h-6" /></Link>
      <Link to={isLoggedIn ? "/myprofile" : "/signup"} className={`${getButtonClass(isLoggedIn ? "/myprofile" : "/signup")} transition-colors`}><User className="w-6 h-6" /></Link>
    </div>
  );
};

export default Navigator;