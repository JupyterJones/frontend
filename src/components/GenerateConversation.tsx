// src/components/GenerateConversation.tsx
import React, { useState } from 'react';

// Define the expected structure of the response from the API
interface ConversationResponse {
    conversation: string;
}

// Define the expected structure of the error response (adjust based on FastAPI's detail format)
interface ErrorResponse {
    detail: string;
}

const GenerateConversation: React.FC = () => {
    const [startPrompt, setStartPrompt] = useState<string>('');
    const [generatedConversation, setGeneratedConversation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // --- State for copy button feedback ---
    const [copyStatus, setCopyStatus] = useState<string>('Copy Text');

    // Backend API URL
    const API_URL = 'http://192.168.1.100:8000/api/generate_conversation';

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStartPrompt(event.target.value);
    };

    const handleGenerate = async () => {
        // (Keep the existing handleGenerate logic exactly as it was)
        // ...
        if (!startPrompt.trim()) {
            setError("Please enter a starting prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedConversation(null); // Clear previous conversation
        setCopyStatus('Copy Text'); // Reset copy button text on new generation

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    start_prompt: startPrompt,
                }),
            });

            if (!response.ok) {
                let errorDetail = `HTTP error! status: ${response.status}`;
                try {
                    const errorData: ErrorResponse = await response.json();
                    if (errorData && errorData.detail) {
                        errorDetail = `Error: ${errorData.detail} (Status: ${response.status})`;
                    }
                } catch (jsonError) {
                    console.error("Could not parse error JSON:", jsonError);
                }
                throw new Error(errorDetail);
            }

            const data: ConversationResponse = await response.json();

            if (data && data.conversation) {
                setGeneratedConversation(data.conversation);
            } else {
                 throw new Error("Received an unexpected response format from the server.");
            }

        } catch (err) {
            console.error("Failed to generate conversation:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
        // ...
    };

    // --- Function to handle copying text ---
    const handleCopy = async () => {
        if (!generatedConversation) return; // Don't copy if there's nothing there

        if (!navigator.clipboard) {
            // Fallback or error for older browsers/insecure contexts
            setError("Clipboard API not available in this browser or context.");
            setCopyStatus('Copy Failed');
            return;
        }

        try {
            await navigator.clipboard.writeText(generatedConversation);
            setCopyStatus('Copied!'); // Provide feedback
            // Reset the button text after a short delay
            setTimeout(() => setCopyStatus('Copy Text'), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setError('Failed to copy text to clipboard.');
            setCopyStatus('Copy Failed');
        }
    };


    return (
        <div style={styles.container}>
            <h2>Generate Conversation / GenerateConversation.tsx</h2>
            <p>Enter a starting prompt, and the AI will generate a conversation using relevant context from the knowledge base.</p>

            <div style={styles.formGroup}>
                <label htmlFor="startPrompt" style={styles.label}>Starting Prompt:</label>
                <textarea
                    id="startPrompt"
                    value={startPrompt}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="e.g., Tell me about state management in React..."
                    style={styles.textarea}
                    disabled={isLoading}
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading || !startPrompt.trim()}
                style={styles.button}
            >
                {isLoading ? 'Generating...' : 'Generate Conversation'}
            </button>

            {/* --- Display Area --- */}
            <div style={styles.resultsArea}>
                {isLoading && <p>Loading conversation...</p>}

                {error && (
                    <div style={styles.errorBox}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {generatedConversation && !isLoading && (
                    <div>
                        <div style={styles.conversationHeader}> {/* Flex container for header + button */}
                            <h3>Generated Conversation:</h3>
                            {/* --- Add the Copy Button --- */}
                            <button
                                onClick={handleCopy}
                                style={styles.copyButton}
                                title="Copy conversation text to clipboard" // Tooltip for clarity
                            >
                                {copyStatus} {/* Display dynamic status */}
                            </button>
                        </div>
                        <pre style={styles.conversationBox}>{generatedConversation}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

// Basic Inline Styles
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '20px auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    textarea: {
        width: '95%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        minHeight: '80px',
        resize: 'vertical',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    resultsArea: {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid #eee',
    },
    errorBox: {
        color: 'red',
        border: '1px solid red',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#ffebee',
        marginTop: '15px',
    },
    // --- Styles for Conversation Header and Copy Button ---
    conversationHeader: {
        display: 'flex', // Use flexbox to align items
        justifyContent: 'space-between', // Puts space between title and button
        alignItems: 'center', // Vertically align items
        marginBottom: '10px', // Space below the header
    },
    copyButton: {
        padding: '5px 10px', // Smaller padding for the copy button
        fontSize: '0.9rem',
        backgroundColor: '#6c757d', // A neutral secondary color
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px', // Space between heading and button
        transition: 'background-color 0.2s ease',
    },
    // --- End of new styles ---
    conversationBox: {
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0',
        padding: '15px',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        marginTop: '0px', // Adjusted margin as space is now handled by conversationHeader
        maxHeight: '500px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        color: 'black',
    },
};

export default GenerateConversation;