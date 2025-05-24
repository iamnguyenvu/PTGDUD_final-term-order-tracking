import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
    reducer: {
        orders: orderReducer,
    },
});

export default store;