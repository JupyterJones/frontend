// components/StockDataComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StockData.css';

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
    const { ticker } = useParams();
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://192.168.1.100:8000/api/stockdata';

    useEffect(() => {
        const fetchStockData = async () => {
            setLoading(true);
            setError(null);

            console.log(`[StockData] Fetching data for ticker: ${ticker}`);
            console.log('[StockData] Ticker value:', ticker); // Log the ticker value

            try {
                if (ticker) {
                    const url = `${apiUrl}/${ticker}`;
                    console.log(`[StockData] Fetching from URL: ${url}`);
                    console.log('[StockData] Constructed URL:', url); // Log the constructed URL
                    const response = await axios.get<StockData[]>(url);
                    console.log('[StockData] API response:', response);
                    setStockData(response.data);
                    console.log('[StockData] Stock data set:', response.data);
                }
            } catch (err: any) {
                console.error('[StockData] Error during fetch:', err);
                console.error('[StockData] Full error object:', err); // Log the full error object
                setError(err.response?.data?.detail || err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
                console.log('[StockData] Fetching completed.');
            }
        };

        fetchStockData();
    }, [ticker]);

    if (loading) {
        console.log('[StockData] Loading state is true.');
        return <div>Loading stock data for {ticker} ...</div>;
    }

    if (error) {
        console.log('[StockData] Error state is true.');
        return <div>Error: {error}</div>;
    }

    if (!ticker) {
        console.log('[StockData] Ticker is not available.');
        return <div>Please select a stock from the menu.</div>;
    }

    if (stockData.length === 0) {
        console.log('[StockData] No stock data received.');
        return <div>No stock data available for {ticker}.</div>;
    }

    console.log('[StockData] Rendering stock data table.');
  return (
        <div className="stock-data-container">
            <h2>30 Day Stock Data for {ticker}</h2>
            <table className="stock-data-table">
                <thead> {/* Single thead */}
                    <tr> {/* Single header row */}
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>  {/* Moved here */}
                        <th>Close</th> {/* Moved here */}
                        <th>Volume</th>{/* Moved here */}
                    </tr>
                </thead>
                <tbody> {/* Single tbody */}
                    {/* Map over stockData ONCE */}
                    {stockData.map((data) => (
                        // Create one complete row per data item
                        <tr key={data.date}>
                            <td>{data.date}</td>
                            <td>{data.open?.toFixed(2)}</td>  {/* Optional: Format numbers */}
                            <td>{data.high?.toFixed(2)}</td> {/* Optional: Format numbers */}
                            <td>{data.low?.toFixed(2)}</td>  {/* Optional: Format numbers */}
                            <td>{data.close?.toFixed(2)}</td>{/* Optional: Format numbers */}
                            <td>{data.volume?.toLocaleString()}</td> {/* Optional: Format numbers */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; // End of component function

export default StockDataComponent;