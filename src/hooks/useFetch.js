import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const response = await axios({
                    url,
                    ...options
                });

                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, JSON.stringify(options)]);

    const refetch = async() => {
        setLoading(true);
        try {
            const response = await axios({
                url,
                ...options
            });

            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
};

export default useFetch;