import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchOrders, 
  selectFilteredOrders, 
  selectOrderStatus, 
  selectOrderError,
  selectFilteredStatus,
  setFilteredStatus
} from '../../features/orders/orderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFilteredOrders);
  const status = useSelector(selectOrderStatus);
  const error = useSelector(selectOrderError);
  const filteredStatus = useSelector(selectFilteredStatus);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      setIsLoading(true);
      dispatch(fetchOrders()).finally(() => setIsLoading(false));
    } else if (status === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status, dispatch]);
  const handleFilterChange = (e) => {
    dispatch(setFilteredStatus(e.target.value));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <div className="text-xl font-semibold text-gray-700">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg p-8 border border-red-200">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <div className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</div>
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => dispatch(fetchOrders())}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          Thử lại
        </button>
      </div>
    );
  }
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Danh sách đơn hàng</h1>
        <p className="text-gray-600">Quản lý và theo dõi tình trạng các đơn hàng của bạn</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-gray-700 font-medium mr-3">Lọc theo trạng thái:</span>
            <div className="relative">
              <select 
                id="status-filter"
                value={filteredStatus}
                onChange={handleFilterChange}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả đơn hàng</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Delivered">Đã giao</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-gray-600">
            <span className="font-medium">{orders.length}</span> đơn hàng được tìm thấy
          </div>
        </div>
      </div>      <div className="overflow-x-auto rounded-xl">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500 text-center max-w-md">
              {filteredStatus === 'all' 
                ? 'Hiện tại chưa có đơn hàng nào trong hệ thống.'
                : `Không có đơn hàng nào với trạng thái "${filteredStatus}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <Link to={`/orders/${order.id}`} key={order.id} className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-500">Đơn hàng #{order.id}</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span> {order.status}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{order.customerName}</h3>
                    <p className="text-gray-600 mb-4"><span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Sản phẩm: {order.items.length}</p>
                        <p className="font-bold text-lg text-indigo-600 mt-1">{formatCurrency(order.total)}</p>
                      </div>
                      <div className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors">
                        Chi tiết
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
