import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.'}
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Trở về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
