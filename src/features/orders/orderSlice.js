import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async() => {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async(id) => {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async({ id, status }) => {
        // Trước tiên, lấy thông tin hiện tại của đơn hàng
        const { data: currentOrder } = await axios.get(`${API_URL}/orders/${id}`);

        // Sau đó cập nhật với phương thức PUT
        const response = await axios.put(`${API_URL}/orders/${id}`, {
            ...currentOrder,
            status
        });
        return response.data;
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        selectedOrder: null,
        status: 'idle',
        error: null,
        filteredStatus: 'all',
    },
    reducers: {
        setFilteredStatus: (state, action) => {
            state.filteredStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
                    state.selectedOrder = action.payload;
                }
            });
    },
});

export const { setFilteredStatus } = orderSlice.actions;

export const selectAllOrders = (state) => state.orders.orders;
export const selectFilteredStatus = (state) => state.orders.filteredStatus;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrderStatus = (state) => state.orders.status;
export const selectOrderError = (state) => state.orders.error;

export const selectFilteredOrders = (state) => {
    const allOrders = selectAllOrders(state);
    const filteredStatus = selectFilteredStatus(state);

    if (filteredStatus === 'all') {
        return allOrders;
    }

    return allOrders.filter(order => order.status === filteredStatus);
};

export default orderSlice.reducer;