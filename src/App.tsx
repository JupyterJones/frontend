// filename: reactjs-learning-assistant/frontend/src/App.tsx
import React from 'react'; // Removed unused useState/useCallback for clarity
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// --- Import Components ---
import Header from './components/Header/Header';
import AskForm from './components/AskForm';
import FileList from './components/FileList';
import SqliteData from './components/SqliteData';
import TextFiles from './components/TextFiles';
import YouTubeVideo from './components/YouTubeVideo';
import ChatInterface from './components/ChatInterface';
import StockDataComponent from './components/StockDataComponent';
import SearchInterface from './components/SearchInterface';
import PostmanVideo from './components/PostmanVideo';
import GenerateConversation from './components/GenerateConversation';
import './App.css';
// Import other components if used (e.g., SecondPage)

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-page-content">
                    <Routes>
                        <Route path="/" element={<AskForm />} />
                        <Route path="/history" element={<SqliteData />} />
                        <Route path="/TextFiles" element={<TextFiles />} />
                        <Route path="/FileList" element={<FileList />} />

                        {/* === CORRECTED ROUTES === */}
                        {/* Change path to match Header Link 'to="/chat"' */}
                        <Route path="/chat" element={<ChatInterface />} />
                        {/* Change path to match Header Link 'to="/search"' */}
                        <Route path="/search" element={<SearchInterface />} />

                        {/* ======================= */}

                        <Route path="/generate-conversation" element={<GenerateConversation />} />
                        <Route path="/stocks/:ticker" element={<StockDataComponent />} />
                        {/* Add other routes here if needed */}
                    </Routes>

                    {/* Video section */}
                    <div className="tubes">
                        <YouTubeVideo />
                        <PostmanVideo />
                    </div>

                </main> {/* End main-page-content */}
            </div> {/* End app-container */}
        </Router>
    );
} // <-- This is the correct closing brace for the App function

// Remove the extra closing brace that was below this line in your second paste
export default App;