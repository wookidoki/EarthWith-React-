import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigator from '../common/Navigator';
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