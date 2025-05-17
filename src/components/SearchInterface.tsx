//// components/SearchInterface.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './SearchInterface.css';

interface SearchResult {
    text: string;
    source?: string;
}

interface EnhancedResponse {
    results: SearchResult[];
    enhanced_summary?: string;
}

function SearchInterface() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [enhancedSummary, setEnhancedSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<EnhancedResponse>('http://192.168.1.100:8000/api/search_and_enhance', {
                query: query,
                num_results: 5, // You can adjust this
            });
            setSearchResults(response.data.results);
            setEnhancedSummary(response.data.enhanced_summary || null);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error during search.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Search and Enhance</h1>
            <input style={{width:'70%',height:'8vw'}}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your search query..."
            />
            <button onClick={handleSearch} disabled={loading}>Search</button>

            {loading && <div>Searching...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {searchResults.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index}>
                                {result.text} {result.source && `(Source: ${result.source})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {enhancedSummary && (
                <div>
                    <h2>Enhanced Summary:</h2>
                    <p>{enhancedSummary}</p>
                </div>
            )}
        </div>
    );
}

export default SearchInterface;