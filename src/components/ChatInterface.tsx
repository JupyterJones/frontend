import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

interface GeminiResponse {
  response: string;
}

const inputStyle: React.CSSProperties = {
  width: '50%',
  height: '200px',
  marginRight: 'auto',
  marginLeft: 'auto',
  textAlign: 'left',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e0e0e0',
  padding: '15px',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  marginTop: '0px',
  overflowY: 'auto',           // Now correctly typed
  display: 'block',
  verticalAlign: 'top',
  fontFamily: 'monospace',
  resize: 'none',
  alignItems: 'flex-start' as any,    // optional workaround
  justifyContent: 'flex-start' as any // optional workaround
};

function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const apiUrl = 'http://192.168.1.100:8000/ask/gemini'; // Your FastAPI API URL

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post<GeminiResponse>(apiUrl, { prompt });
      setGeminiResponse(response.data);
    } catch (error: any) {
      console.error('There was an error sending the request:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <h1>Chat with Gemini / ChatInterface.tsx</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          style={inputStyle}
          value={prompt}
          onChange={handleInputChange}
          placeholder="Ask a question..."
        />
        <br />
        <button type="submit">Send</button>
      </form>

      {geminiResponse && (
        <div>
          <h2>Gemini's Response:</h2>
          <p>{geminiResponse.response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
