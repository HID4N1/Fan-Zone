import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './UserLayout.css';

const UserLayout = () => {
  return (
    <>
      <Navbar />
    <div className="main">
        <Outlet />
        </div>
      <Footer />
    </>
  );
};

export default UserLayout;
