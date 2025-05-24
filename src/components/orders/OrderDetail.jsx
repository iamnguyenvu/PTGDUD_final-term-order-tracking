import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrderById,
  updateOrderStatus,
  selectSelectedOrder,
  selectOrderStatus,
  selectOrderError
} from '../../features/orders/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector(selectSelectedOrder);
  const status = useSelector(selectOrderStatus);
  const error = useSelector(selectOrderError);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(parseInt(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setUpdateSuccess(false);
  };
  const handleUpdateStatus = async () => {
    if (selectedStatus !== order.status) {
      try {
        setIsUpdating(true);
        const resultAction = await dispatch(updateOrderStatus({ id: order.id, status: selectedStatus }));
        
        // Kiểm tra kết quả từ action
        if (updateOrderStatus.fulfilled.match(resultAction)) {
          setUpdateSuccess(true);
          setTimeout(() => setUpdateSuccess(false), 3000);
        } else {
          console.error('Không thể cập nhật trạng thái:', resultAction.error);
        }
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColorClass = (statusValue) => {
    switch(statusValue) {
      case 'Pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  const getStatusIcon = (statusValue) => {
    switch(statusValue) {
      case 'Pending':
        return '⏳';
      case 'Processing':
        return '🔄';
      case 'Delivered':
        return '✅';
      case 'Cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <div className="text-xl font-semibold text-gray-700">Đang tải dữ liệu đơn hàng...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg p-8 border border-red-200">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-red-600 mb-2">Không thể tải thông tin đơn hàng</div>
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => dispatch(fetchOrderById(parseInt(id)))}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          Thử lại
        </button>
        <button 
          onClick={handleGoBack}
          className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
        >
          Quay lại
        </button>
      </div>
    );
  }
  if (!order && status !== 'loading') {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md p-10">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy đơn hàng</div>
        <div className="text-gray-500 mb-4 text-center">
          Đơn hàng với ID: <span className="font-medium">{id}</span> không tồn tại hoặc đã bị xóa.<br/>
          Vui lòng kiểm tra lại mã đơn hàng.
        </div>
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Trở lại danh sách đơn hàng
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-white shadow-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg> 
          Quay lại danh sách
        </button>
        
        {updateSuccess && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md flex items-center animate-fade-in">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cập nhật thành công!
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-800">Đơn hàng #{order.id}</h1>
              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColorClass(order.status)} flex items-center`}>
                <span className="mr-1">{getStatusIcon(order.status)}</span> {order.status}
              </div>
            </div>
            <p className="text-gray-500 mt-2">Ngày tạo: {formatDate(order.createdAt)}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-gray-700 font-medium">Cập nhật trạng thái:</label>
            <div className="flex">
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isUpdating}
              >
                <option value="Pending">Chờ xử lý</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Delivered">Đã giao</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={selectedStatus === order.status || isUpdating}
                className={`px-4 py-2 rounded-r-lg flex items-center ${
                  selectedStatus === order.status || isUpdating
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang cập nhật...
                  </span>
                ) : (
                  'Cập nhật'
                )}
              </button>
            </div>
          </div>
        </div>        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full mr-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Thông tin khách hàng</h2>
            </div>
            <div className="space-y-3 pl-2">
              <div className="flex">
                <span className="w-1/3 text-gray-600">Tên khách hàng:</span>
                <span className="w-2/3 font-medium">{order.customerName}</span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-gray-600">Ngày đặt hàng:</span>
                <span className="w-2/3">{formatDate(order.createdAt)}</span>
              </div>
              {order.note && (
                <div>
                  <span className="text-gray-600">Ghi chú:</span>
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm italic text-gray-700">
                    {order.note}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Thông tin thanh toán</h2>
            </div>
            <div className="space-y-3 pl-2">
              <div className="flex">
                <span className="w-1/2 text-gray-600">Số lượng sản phẩm:</span>
                <span className="w-1/2 font-medium">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-gray-600">Số loại sản phẩm:</span>
                <span className="w-1/2 font-medium">{order.items.length}</span>
              </div>
              <div className="flex mt-4 pt-3 border-t">
                <span className="w-1/2 text-gray-700 font-semibold">Tổng thanh toán:</span>
                <span className="w-1/2 font-bold text-xl text-green-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mt-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Danh sách sản phẩm</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center bg-gray-100 rounded-md w-12 py-1">
                      {item.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50">
                <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-700">Tổng cộng:</td>
                <td className="px-6 py-4 font-bold text-lg text-indigo-700">{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
