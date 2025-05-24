import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';
import ErrorPage from './components/error/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <OrderList />
      },
      {
        path: 'orders/:id',
        element: <OrderDetail />
      }
    ]
  }
]);

export default router;
