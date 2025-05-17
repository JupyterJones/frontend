// Example Header.tsx (or wherever your header is defined)
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router
import './Header.css'; // Import your CSS file

function Header() {
  return (
    // Add a class name to the main header container
    <header className="sticky-app-header">
      <h1>Gemini 1.5 Educational Assistant</h1>
<p>This application uses a combination of ChromaDB, FastAPI, 2 Sqlite3 Databases, Gemini 1.5 flash, pydantic and sentence_transformers to create an outstanding educational platform.</p>
      {/* Group Navigation Links - consider using <nav> */}
      <nav className="header-nav">
        <div>
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          {/* Assuming FileList/TextFiles points to the same route */}
          <Link to="/textfiles">TextFiles</Link>
        </div>
        <div>
          <Link to="/search">SearchInterface</Link>
          <Link to="/chat">ChatInterface</Link>
          <Link to="/generate-conversation">Generate Conversation</Link>
          <Link to="/FileList">FileList</Link>
        </div>
      </nav>

      {/* Stock Info Section */}
      <div className="header-stock-info">
        <p>30 Day Indexes: Apple, Microsoft and Google</p>
        <div>
          {/* Make sure these are actual links if intended */}
          <Link to="/stocks/AAPL">AAPL</Link>
          <Link to="/stocks/MSFT">MSFT</Link>
          <Link to="/stocks/GOOGL">GOOGL</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

// --- In your main App layout (e.g., App.tsx) ---
// Make sure the Header is rendered outside the main scrollable content area
//import Header from './Header';
// ... other imports

//function App() {
//  return (
//    <div className="app-container">
//      <Header /> {/* Render the header */}
//      {/* Add a class to wrap the main content that will scroll */}
//      <main className="main-page-content">
//        {/* Your Routes / Page Content Here */}
//        {/* Example: <Routes>...</Routes> */}
//      </main>
//    </div>
//  );
//}