import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigator from '../common/Navigator'; // 경로 변경
// Header, Footer는 제공되지 않아 주석 처리하거나 기존 경로 유지
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Header/>
      <div className="pt-20">
        <Outlet /> 
      </div>
      <Footer/>
      <Navigator />
    </>
  );
};

export default MainLayout;