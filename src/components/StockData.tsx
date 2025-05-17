// components/StockData.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface StockData {
    ticker: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const StockDataComponent: React.FC = () => {
    const { ticker } = useParams(); // Get ticker from URL
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://192.168.1.100:8000/api/stockdata'; // Base API URL
    useEffect(() => {
        const fetchStockData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (ticker) { // Check if ticker is available before fetching
                    const response = await axios.get<StockData[]>(`${apiUrl}/${ticker}`);
                    setStockData(response.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.detail || err.message || 'An unexpected error occurred.');
                console.error("Error fetching stock data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [ticker]); // Re-fetch data if the ticker changes

    if (loading) {
        return <div>Loading stock data for {ticker} ...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!ticker) {
        return <div>Please select a stock from the menu.</div>;
    }

    if (stockData.length === 0) {
        return <div>No stock data available for {ticker}.</div>;
    }

    return (
        <div className="stock-data-container">
            <h2>Stock Data for {ticker}</h2>
            <table className="stock-data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map((data) => (
                        <tr key={data.date}>
                            <td>{data.date}</td>
                            <td>{data.open}</td>
                            <td>{data.high}</td>
                            <td>{data.low}</td>
                            <td>{data.close}</td>
                            <td>{data.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockDataComponent;