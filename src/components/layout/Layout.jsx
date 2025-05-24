import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight hover:text-indigo-100 transition duration-300">
            <span className="inline-block mr-1">📦</span>
            Hệ thống theo dõi đơn hàng
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="font-medium hover:bg-white/20 px-4 py-2 rounded-md transition duration-300">Trang chủ</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">&copy; 2025 Hệ thống theo dõi đơn hàng</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
